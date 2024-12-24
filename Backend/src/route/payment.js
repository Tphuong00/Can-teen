import express from "express";
import paymentController from '../controllers/PaymentController';

let router = express.Router();

let initPaymentRoutes = (app) => {
    // API route tạo thanh toán PayPal
    router.post('/api/create-paypal-payment', paymentController.createPaypalPayment);

    // API route xử lý thanh toán thành công
    router.post('/api/paypal/payment-success', paymentController.paymentSuccess);

    // API route xử lý thanh toán bị hủy
    router.post('/api/paypal/payment-cancelled', paymentController.paymentCancelled);

    router.post('/api/momo/create-momo-payment', paymentController.createMomoPayment);

    return app.use("/", router);
}

module.exports = initPaymentRoutes;
