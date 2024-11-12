import express from "express";
import productController from '../controllers/productController';
import authMiddleware from '../middleware/authMiddleware';
import upload from "../middleware/multer";

let router = express.Router();

let initProductRoutes = (app) => {

    router.post('/api/postProduct', upload.single('image'), productController.handleCreateProduct);
    router.get('/createProduct', (req, res) => {
        res.render('product'); // Render file createNews.ejs
    });
    router.get('/api/getProduct', productController.getProduct);
    router.get('/api/:slug', productController.getProductDetails);



    return app.use("/", router);
}

module.exports = initProductRoutes;
