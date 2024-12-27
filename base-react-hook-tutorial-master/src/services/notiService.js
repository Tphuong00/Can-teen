import axios from "../setup/axios";

const getNotifications = (userID) => {
    return axios.get(`/api/noti/${userID}`)
};

const createNotification = (message, userID) => {
    return axios.post(`/api/noti/create`, { message, userID })
};

const markAsReadApi =  (id) => {
    return axios.put(`/api/mark-as-read/${id}`)
};

export {
    getNotifications,
    createNotification,
    markAsReadApi
}