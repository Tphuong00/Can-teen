import axios from "../setup/axios";

const getNews =() =>{
    return axios.get(`/api/news`);
}

const getNewsDetail = (slug) => {
    return axios.get(`/api/news/${slug}`);
};

export {
    getNews,
    getNewsDetail
}