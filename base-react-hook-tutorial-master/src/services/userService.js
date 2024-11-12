import axios from "../setup/axios";

const registerNewUser = (email, fullname, password) =>{
    return axios.post('/api/register', {
        email, fullname, password
    })
}

const loginUser = (email, password) => {
    return axios.post('/api/login', {
        email, password
    })
}
const UpdateUser = (email, fullname, address, phonenumber, roleID) =>{
    return axios.put('/api/update', {
        email, fullname, address, phonenumber, roleID
    })
}

const getUserInfo =()=>{
    return axios.get('/api/getuser');
}

const changePassword = (currentPassword, newPassword) =>{
    return axios.put('/api/update/password', {currentPassword, newPassword})
}

export {
    registerNewUser,
    loginUser,
    UpdateUser,
    getUserInfo,
    changePassword
};