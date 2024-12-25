const paypal = require('paypal-rest-sdk');
const crypto = require('crypto');
const { default: axios } = require('axios');

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

const createMomoPayment = async (req, res) => {
    var partnerCode = "MOMO";
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = "pay with MoMo";
    var redirectUrl = "https://momo.vn/return";
    var ipnUrl = "https://callback.url/notify";
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    var amount = "50000";
    var requestType = "captureWallet"
    var extraData = ""; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
    //puts raw signature

    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        accessKey : accessKey,
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        extraData : extraData,
        requestType : requestType,
        signature : signature,
        lang: 'en'
    });

    const options = {
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data : requestBody
    }

    let result;
    try {
        result = await axios(options);
        return res.status(200).json(result.data);
    }catch (err) {
        return res.status(500).json({
            statusCode: '500',
            message: 'server error'
        })
    }  
}

module.exports = {
    createPaypalPayment,
    paymentSuccess,
    paymentCancelled,
    createMomoPayment
};
