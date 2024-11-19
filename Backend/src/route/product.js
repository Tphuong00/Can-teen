import express from "express";
import productController from '../controllers/productController';
import authMiddleware from '../middleware/authMiddleware';
import upload from "../middleware/multer";

let router = express.Router();

let initProductRoutes = (app) => {

    //tạo sản phẩm
    router.post('/api/postProduct', upload.single('image'), productController.handleCreateProduct);
    router.get('/createProduct', (req, res) => {
        res.render('product'); // Render file createNews.ejs
    });
    //lấy tất cả sản phẩm
    router.get('/api/getProduct', productController.getProduct);
    //lấy chi tiết sản phẩm
    router.get('/api/:slug', productController.getProductDetails);
    // Lấy các sản phẩm liên quan
    router.get('/api/:category/related', productController.getRelatedProducts);
    // Thêm đánh giá sản phẩm
    router.post('/api/review/:slug', authMiddleware,productController.addProductReview);
    //Lấy đánh giá sản phẩm
    router.get('/api/review/:slug', productController.getProductReview);

    return app.use("/", router);
}

module.exports = initProductRoutes;
