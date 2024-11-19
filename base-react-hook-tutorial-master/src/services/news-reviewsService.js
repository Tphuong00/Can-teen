import axios from "../setup/axios";

const getNews =() =>{
    return axios.get(`/api/news`);
}

const getNewsDetail = (slug) => {
    return axios.get(`/api/news/${slug}`);
};

const submitReview = (slug,reviewData) => {
    return axios.post(`/api/review/${slug}`, {
        reviewData
    });
};

const getReview = (slug) => {
    return axios.get(`/api/review/${slug}`);
};

export {
    getNews,
    getNewsDetail,
    submitReview,
    getReview 
}