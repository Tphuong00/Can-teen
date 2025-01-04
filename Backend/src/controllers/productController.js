import db from '../models/index';
import cloudinary from '../config/cloudinary'; 
import fs from 'fs';
const {Op} = require('sequelize');
const jwt = require('jsonwebtoken');

exports.handleCreateProduct= async (req, res) =>{
        try {
            // Kiểm tra nếu không có file được tải lên
            if (!req.file) {
                return res.status(400).send('No image uploaded');
            }
    
            // Upload ảnh lên Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
    
            const { itemName, description, price, category, mealTime, availability } = req.body;
            const imgURL = result.secure_url;
    
            // Lưu vào cơ sở dữ liệu
            await db.Menu_Items.create({
                itemName,
                description,
                price,
                category, // Kiểm tra category có đúng không
                imageUrl: imgURL,
                mealTime,
                availability: availability === 'true',
            });
    
            // Xóa file tạm sau khi tải lên
            fs.unlinkSync(req.file.path);
    
            res.send('Product created successfully');
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).send('Error occurred while creating product');
        }
    };

exports.getProduct = async (req, res) =>{
    try {       
        const { category, price, mealTime, sort, page, limit } = req.query;
        // Điều kiện lọc cho query
        const filters = {};

        if (category) filters.category = category;

        if (price) {
            if (String(price).includes('>')) {
                const min = String(price).replace('>', '').trim();
                if (isNaN(min)) {
                    return res.status(400).send('Invalid price range format');
                }
                filters.price = { [Op.gt]: Number(min) };
            } else if (String(price).includes('-')) {
                const [min, max] = String(price).split('-');
                if (isNaN(min) || isNaN(max)) {
                    return res.status(400).send('Invalid price range format');
                }
                filters.price = { [Op.between]: [Number(min), Number(max)] };
            }
        }

        if (mealTime) filters.mealTime = mealTime;
        
        // Điều kiện sắp xếp
        let order = [];
        if (sort === 'price_asc') order.push(['price', 'ASC']);
        else if (sort === 'price_desc') order.push(['price', 'DESC']);
        else if (sort === 'name_asc') order.push(['itemName', 'ASC']);
        else if (sort === 'name_desc') order.push(['itemName', 'DESC']);

        // Điều kiện phân trang
        const itemsPerPage = parseInt(limit) || 10;
        const offset = (parseInt(page) || 0) * itemsPerPage;

        // Truy vấn sản phẩm với các điều kiện lọc, sắp xếp, và phân trang
        const products = await db.Menu_Items.findAll({
            where: filters,
            order,
            limit: itemsPerPage,
            offset,
        });
        
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving products' });
    }
}

exports.getProductDetails = async (req, res) => {
    try {
        const { slug } = req.params;

        // Lấy tất cả các sản phẩm và bao gồm đánh giá
        const product = await db.Menu_Items.findOne({
            where: {
                itemName: db.Sequelize.where(
                    db.Sequelize.fn('lower', db.Sequelize.fn('replace', db.Sequelize.col('itemName'), ' ', '-')),
                    slug
                ),
            }
        });
        
        // Kiểm tra nếu sản phẩm không được tìm thấy
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product); // Trả về sản phẩm dưới dạng JSON
    } catch (error) {
        console.error('Error retrieving product details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getRelatedProducts = async (req, res) => {
    try {
        const { category } = req.params;

        // Tìm các sản phẩm cùng loại
        const relatedProducts = await db.Menu_Items.findAll({
            where: { category },
            limit: 3,
        });

        if (relatedProducts.length === 0) {
            return res.status(404).json({ error: 'No related products found' });
        }

        res.status(200).json(relatedProducts);
    } catch (error) {
        console.error('Error retrieving related products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getProductReview = async (req, res) => {
    try {
        const { slug } = req.params;

        // Tìm sản phẩm dựa trên slug
        const product = await db.Menu_Items.findOne({
            where: {
                itemName: db.Sequelize.where(
                    db.Sequelize.fn('lower', db.Sequelize.fn('replace', db.Sequelize.col('itemName'), ' ', '-')),
                    slug.toLowerCase()
                )
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Lấy tất cả review của sản phẩm
        const reviews = await db.Review.findAll({
            where: { itemID: product.id },
            include: [
                { model: db.Users, as: 'User', attributes: ['fullname'] }
            ],
            order: [['createdAt', 'DESC']],
            raw: true
        });

        // Tính tổng trung bình rating
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        // Trả về các review và tổng rating trung bình
        res.status(200).json({ reviews, averageRating });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addProductReview = async (req, res) => {
    try {
        const { slug } = req.params;
        const {rating, comment} = req.body.reviewData;
        const userID = req.user?.id;

        if (!userID) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Kiểm tra dữ liệu đầu vào
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        if (!comment || comment.trim() === '') {
            return res.status(400).json({ error: 'Comment cannot be empty' });
        }

        // Tìm sản phẩm dựa trên slug
        const product = await db.Menu_Items.findOne({
            where: {
                itemName: db.Sequelize.where(
                    db.Sequelize.fn('lower', db.Sequelize.fn('replace', db.Sequelize.col('itemName'), ' ', '-')),
                    slug
                )
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Tạo đánh giá mới
        const newReview = await db.Review.create({
            itemID: product.id,
            userID,
            comment,
            rating
        });

        res.status(201).json({ message: 'Review added successfully.', review: newReview });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addToLikelist = async (req, res) => {
    try {
      const { itemID } = req.body;
      const userID = req.user?.id;

    if (!userID) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
  
      // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
      const existingItem = await db.LikeLists.findOne({
        where: { userID, itemID },
      });
  
      if (existingItem) {
        return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích.' });
      }
  
      // Thêm sản phẩm vào danh sách yêu thích
      const newLikelistItem = await db.LikeLists.create({ userID, itemID });
      res.status(201).json({ message: 'Sản phẩm đã được thêm vào danh sách yêu thích.' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server khi thêm vào danh sách yêu thích.' });
    }
  };

exports.getLikelist = async (req, res) => {
    try {
        const userID = req.user.id; // Lấy userID từ middleware (đã xác thực)
    
        // Lấy danh sách sản phẩm yêu thích của người dùng
        const likedItems = await db.LikeLists.findAll({
          where: { userID },
          include: [
            {
              model: db.Menu_Items,
              as: 'item', // Nếu sử dụng mối quan hệ 1-n giữa LikeLists và Menu_Items
            }
          ],
          raw: true
        });
        
        const likedProductIds = likedItems.map(like => like.itemID);
    
        // Trả về các sản phẩm yêu thích
        const products = await db.Menu_Items.findAll({
          where: {
            id: likedProductIds
          }
        });
    
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình xử lý' });
      }
};
  
exports.removeFromLikelist = async (req, res) => {
    try {
      const { itemID } = req.body;
      const userID = req.user?.id;
      // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
      const existingItem = await db.LikeLists.findOne({
        where: { userID, itemID },
      });
  
      if (!existingItem) {
        return res.status(404).json({ message: 'Sản phẩm không có trong danh sách yêu thích.' });
      }

      await db.LikeLists.destroy({
        where: { userID, itemID }
      });
      res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi danh sách yêu thích.' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm khỏi danh sách yêu thích.' });
    }
};

exports.getSearch = async (req, res) => {
    const { query } = req.query;  // Lấy query từ tham số truy vấn
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const items = await db.Menu_Items.findAll({
            where: {
                itemName: {
                    [Op.like]: `%${query}%`  // Tìm kiếm không phân biệt chữ hoa/thường
                }
            },
            limit: 10  // Giới hạn số kết quả trả về
        });

        return res.status(200).json(items);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
  

