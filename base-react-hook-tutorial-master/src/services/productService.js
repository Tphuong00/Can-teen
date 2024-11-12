import axios from "../setup/axios";

const getProducts = (params) => {
    return axios.get('/api/getProduct', { params });
};
const getProductDetail = (slug) => {
    return axios.get(`/api/${slug}`);
};

export {
    getProducts, getProductDetail
}