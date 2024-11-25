import axios from "../setup/axios";

const addToLikelist = async (itemID) => {
    return axios.post('/api/likelist/add', { itemID });
};
  
const removeFromLikelist = async (itemID) => {
    return axios.delete('/api/likelist/remove', {data: { itemID }});
};
  
const getLikelist = async (userID) => {
    return axios.get('/api/likelist/getlikelist', { userID });
};

export {
    addToLikelist,
    removeFromLikelist,
    getLikelist
}