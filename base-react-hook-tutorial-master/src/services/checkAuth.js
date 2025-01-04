import axios from "../setup/axios";

const checkAuth = () => {
    return axios.get("/api/checkAuth", {withCredentials: true});
}
const logout = async () => {
    return await axios.get("/api/logout");
};
export {
    checkAuth,
    logout
};