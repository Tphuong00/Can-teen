import express from "express";
import orderController from '../controllers/orderController';
import authMiddleware from '../middleware/authMiddleware';

let router = express.Router();

let initOrderRoutes = (app) => {
    router.post('/api/createorder', orderController.createOrder);

    router.post('/api/paymentResult', orderController.paymentResult);

    return app.use("/", router);

}

module.exports = initOrderRoutes;
