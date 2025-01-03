import express from "express";
import homeController from '../controllers/homeController';
import authMiddleware from '../middleware/authMiddleware';
import upload from '../middleware/multer';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);

    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);

    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    // router.post('/api/post-news', upload.single('imgURL'), homeController.postNews);
    router.post('/api/post-news', upload.single('imgURL'), (req, res) => {
        console.log('Form data received:', req.body);
        console.log('File data received:', req.file);
        homeController.postNews(req, res);
    });
    
    router.get('/create-news', (req, res) => {
        res.render('new'); // Render file createNews.ejs
    });

    return app.use("/", router);
}

module.exports = initWebRoutes;