import axios from "../setup/axios";

const applyDiscount = async (discountCode) => {
    return axios.post('/api/applydiscount', { code: discountCode } );
};
// Hàm tạo đơn hàng
const createOrder = (orderData) => {
    return axios.post("/api/createorder", orderData);
};

const createMomoPayment = async (amount, orderId, orderInfo) => {
    return axios.post('/api/momo/create-momo-payment', {
            amount,
            orderId,
            orderInfo,
        });
};

const getOrder = () => {
    return axios.get(`/api/order/orderHistory`);
}

export {
    applyDiscount, 
    createOrder,
    createMomoPayment,
    getOrder
}