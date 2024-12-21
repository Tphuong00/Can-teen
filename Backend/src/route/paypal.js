import express from "express";
import paypalController from '../controllers/paypalController';

let router = express.Router();

let initPayPalRoutes = (app) => {
    // API route tạo thanh toán PayPal
    app.post('/api/create-paypal-payment', paypalController.createPaypalPayment);

    // API route xử lý thanh toán thành công
    app.post('/api/paypal/payment-success', paypalController.paymentSuccess);

    // API route xử lý thanh toán bị hủy
    app.post('/api/paypal/payment-cancelled', paypalController.paymentCancelled);

    return app.use("/", router);
}

module.exports = initPayPalRoutes;
