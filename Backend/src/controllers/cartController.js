import db from '../models/index';
import cloudinary from '../config/cloudinary'; 
import fs from 'fs';

exports.getCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: 'Không có thông tin người dùng.' });
    }
    const userID = req.user.id;  

    if (!userID) {
      return res.status(400).json({ message: 'Không có userID để lấy giỏ hàng.' });
    }

    // Truy vấn giỏ hàng từ cơ sở dữ liệu
    const cart = await db.Cart.findAll({
      where: { userID },
      include: [
        {
          model: db.Menu_Items,
          as: 'Menu_Item',
          attributes: ['itemName', 'price', 'imageUrl'],
        },
      ],
      raw: true,
    });


    return res.status(200).json(cart);
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy giỏ hàng.' });
  }
};

  
  // Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    try {
        const {itemID, quantity } = req.body;
        const userID = req.user?.id;
        if (!userID) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa và include thông tin Menu_Item
        let cartItem = await db.Cart.findOne({
            where: { userID, itemID },
            include: {
                model: db.Menu_Items,
                as: 'Menu_Item',
            },
            raw: false
        });

        if (cartItem) {
            // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
            cartItem.quantity += quantity;
            // Kiểm tra nếu Menu_Item có tồn tại
            if (cartItem.Menu_Item) {
                cartItem.priceTotal = cartItem.quantity * cartItem.Menu_Item.price;
            } else {
                throw new Error('Không thể truy xuất thông tin sản phẩm.');
            }

            await cartItem.save();
            return res.status(200).json({ message: 'Giỏ hàng đã được cập nhật.' });
        }

        // Nếu chưa có sản phẩm trong giỏ, thêm mới vào giỏ hàng
        const product = await db.Menu_Items.findByPk(itemID);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
        }

        const newCartItem = await db.Cart.create({
            userID,
            itemID,
            quantity,
            priceTotal: quantity * product.price,
        });

        return res.status(201).json(newCartItem);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server khi thêm vào giỏ hàng.' });
    }
};

  
  // Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
    try {
        const { cartID } = req.body;
    
        // Tìm giỏ hàng cần xóa
        const cartItem = await db.Cart.findByPk(cartID);
    
        if (!cartItem) {
          return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng.' });
        }
    
        // Xóa sản phẩm khỏi giỏ hàng
        await db.Cart.destroy({
          where: { id: cartID }  
      });
    
        return res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm khỏi giỏ hàng.' });
    }
};

exports.updateCart = async (req, res) => {
    try {
      const { cartID } = req.body;
      const { quantity } = req.body;
  
      // Tìm giỏ hàng cần chỉnh sửa
      const cartItem = await db.Cart.findByPk(cartID);
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng.' });
      }
  
      // Cập nhật số lượng và tổng giá trị
      cartItem.quantity = quantity;
      cartItem.priceTotal = cartItem.quantity * cartItem.Menu_Item.price;
  
      await cartItem.save();
  
      return res.status(200).json({ message: 'Giỏ hàng đã được cập nhật.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server khi cập nhật giỏ hàng.' });
    }
};