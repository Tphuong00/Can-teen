// controllers/paypalController.js
const paypal = require('paypal-rest-sdk');

// Cấu hình PayPal SDK
paypal.configure({
    mode: 'sandbox', // Hoặc 'live' nếu bạn đã sẵn sàng cho môi trường thực tế
    client_id: 'ARoOsXEdJUez7GIMZlH1AlLvhT231X5DqX2DJYBIJAZVUoTDHVIlZ9U6SllTkHsj7s8wBnJPwut8SJFt', 
    client_secret: 'EOsFJNtxc7bd5nxlTDM5AWacXFVg4tIhb_cV4UGp6yd4V9FYsiCPme2ldiQr0q4dJy65zh7aR-kJ5BHO',
});

// Tạo một yêu cầu thanh toán PayPal
const createPaypalPayment = (req, res) => {
    const { amount, orderId } = req.body;

    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        redirect_urls: {
            return_url: 'http://localhost:3000/api/paypal/payment-success', // URL trả về sau khi thanh toán thành công
            cancel_url: 'http://localhost:3000/api/paypal/payment-cancelled', // URL hủy thanh toán
        },
        transactions: [{
            amount: {
                total: amount,
                currency: 'USD',
            },
            description: `Thanh toán cho đơn hàng ${orderId}`,
        }],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error processing PayPal payment.');
        } else {
            // Tìm đường dẫn approval_url trong phản hồi từ PayPal
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.json({ approval_url: payment.links[i].href });
                }
            }
        }
    });
};

// Xử lý khi thanh toán thành công
const paymentSuccess = (req, res) => {
    const { orderId, paymentID } = req.body;
    // Xử lý thanh toán thành công
    console.log(`Thanh toán cho đơn hàng ${orderId} thành công với payment ID: ${paymentID}`);
    res.json({ status: 'success' });
};

// Xử lý khi thanh toán bị hủy
const paymentCancelled = (req, res) => {
    console.log("Thanh toán bị hủy");
    res.status(400).json({ status: 'cancelled' });
};

module.exports = {
    createPaypalPayment,
    paymentSuccess,
    paymentCancelled,
};
