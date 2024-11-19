import axios from "../setup/axios";

const getProducts = (params) => {
    return axios.get('/api/getProduct', { params });
};
const getProductDetail = (slug) => {
    return axios.get(`/api/${slug}`);
};
const getRelatedProducts =(category)=>{
    return axios.get(`/api/${category}/related`);
}


export {
    getProducts, getProductDetail, getRelatedProducts
}