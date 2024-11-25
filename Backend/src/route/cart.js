import express from "express";
import cartController from '../controllers/cartController';
import authMiddleware from '../middleware/authMiddleware';

let router = express.Router();

let initCartRoutes = (app) => {
    // Lấy giỏ hàng của người dùng
    router.get('/api/cart/getCart', authMiddleware, cartController.getCart);

    // Thêm sản phẩm vào giỏ hàng
    router.post('/api/addcart', authMiddleware,cartController.addToCart);

    // Xóa sản phẩm khỏi giỏ hàng
    router.delete('/api/deletecart', cartController.removeFromCart);

    //Chỉnh lượng số lượng sản phẩm trong giỏ hàng
    router.put('/api/updatecart', cartController.updateCart); 

    return app.use("/", router);

}

module.exports = initCartRoutes;
