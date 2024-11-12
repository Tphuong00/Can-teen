import express from "express";
import checkauthController from '../controllers/checkauthController';
import authMiddleware from '../middleware/authMiddleware';

let router = express.Router();

let initCheckAuthRoutes = (app) => {
    router.get('/api/checkAuth', authMiddleware, checkauthController.handleCheckAuth);
    router.get('/api/logout', authMiddleware, checkauthController.handlelogout);

    return app.use("/", router);
}

module.exports = initCheckAuthRoutes;