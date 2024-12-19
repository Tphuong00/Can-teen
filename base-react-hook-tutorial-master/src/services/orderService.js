import axios from "../setup/axios";

const applyDiscount = async (discountCode) => {
    return axios.post('/api/applydiscount', { code: discountCode } );
};
// Hàm tạo đơn hàng
const createOrder = (orderData) => {
    return axios.post("/api/createorder", orderData);
};

const handleMomoPayment = async (order) => {
    try {
        // Gửi yêu cầu thanh toán MOMO
        const momoResponse = await axios.post('MOMO_PAYMENT_URL', {
            orderID: order.id,
            amount: order.pricetotal,
        });

        if (momoResponse.data.status === 'SUCCESS') {
            // Thanh toán MOMO thành công, gửi kết quả về backend
            const paymentResult = await axios.post('http://localhost:5000/api/orders/paymentResult', {
                orderID: order.id,
                paymentStatus: 'success',
            });

            console.log('Thanh toán MOMO thành công', paymentResult.data);
        } else {
            console.error('Thanh toán MOMO thất bại');
        }
    } catch (error) {
        console.error('Lỗi khi thanh toán MOMO:', error);
    }
};

export {
    applyDiscount, 
    createOrder,
    handleMomoPayment
}