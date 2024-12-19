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

const getSearch = (query) => {
    return axios.get('/api/search/getSearch', { params: { query }});
}


export {
    getProducts, getProductDetail, getRelatedProducts, getSearch
}