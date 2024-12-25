import express from "express";
import promotionController from '../controllers/promotionController';
import authMiddleware from '../middleware/authMiddleware';

let router = express.Router();

let initPromotionRoutes = (app) => {
    router.post('/api/applydiscount', authMiddleware,promotionController.applyPromotion);


    return app.use("/", router);

}

module.exports = initPromotionRoutes;