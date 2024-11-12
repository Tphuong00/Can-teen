import jwt from 'jsonwebtoken';
require('dotenv').config();

export const handleCheckAuth = (req, res) => {   

    const token = req.cookies.token;  // Lấy token từ cookie

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: err.message });
        }
        // Nếu token hợp lệ, trả về thông tin người dùng
        res.status(200).json({ message: "Authenticated successfully", user: decoded });
        
    });
};


const handlelogout = (req, res) => {
    res.clearCookie("token"); 
    res.status(200).json({ message: "Logged out successfully" });
};

export default {
    handleCheckAuth: handleCheckAuth,
    handlelogout: handlelogout
};
