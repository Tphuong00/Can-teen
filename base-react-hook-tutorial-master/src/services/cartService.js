import axios from "../setup/axios";

const getCart = () => {
    return axios.get('/api/cart/getCart');

};
  
const addToCart = async (itemID, quantity) => {
    return axios.post('/api/addcart', {itemID, quantity });
    
};
  
const removeFromCart = async (cartID) => {
    return axios.delete('/api/deletecart', {data: { cartID } });
    
};
  
const updateCart = async (cartID, quantity) => {
    return axios.put('/api/updatecart', { cartID ,quantity });
};

export {
    getCart,
    addToCart,
    removeFromCart,
    updateCart,
}