require("dotenv").config();
import jwt from 'jsonwebtoken';

module.exports = (req, res, next) => {
	// const token = req.headers["access-token"];
	const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
	if (!token) {
		return res.status(401).json({
			message: "Auth failed",
		});
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		return res.status(401).json({
			message: "Auth failed",
		});
	}
	if (!decodedToken) {
		return res.status(401).json({
			message: "Auth failed",
		});
	}
	req.user = decodedToken.user;
	console.log("Auth successful!");
	next();
}

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: "Token is missing" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Token is invalid" });
        req.user = user; // Lưu thông tin người dùng vào req
        next();
    });
};
