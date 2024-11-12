import db from '../models/index';
import cloudinary from '../config/cloudinary'; 
import fs from 'fs';
const {Op} = require('sequelize');
const slugify = require('slugify');

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

exports.getProductDetails =async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await db.Product.findAll({
            where: { itemName: { [Op.like]: `%${slugify(slug, { lower: true })}%` } }
        });

        if (!product || product.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}