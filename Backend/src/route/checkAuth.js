import express from "express";
import passport from'passport';
import checkauthController from '../controllers/checkauthController';
import authMiddleware from '../middleware/authMiddleware';

let router = express.Router();

let initCheckAuthRoutes = (app) => {
    router.get('/api/checkAuth', authMiddleware, checkauthController.handleCheckAuth);
    router.get('/api/logout', authMiddleware, checkauthController.handlelogout);

    // Quên mật khẩu
    router.post('/api/forgot-password', checkauthController.handleForgotPassword);
    // Đặt lại mật khẩu
    router.post('/api/reset-password/:token', checkauthController.handleResetPassword);

    router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

    // Facebook callback route
    router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
        const token = req.user;
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge:  30 * 24 * 60 * 60 * 1000, });
        // Điều hướng người dùng đến trang home
        res.redirect('https://can-teen.vercel.app/home');
    });

    // Google login route
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // Google callback route
    router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
        const token = req.user;
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge:  30 * 24 * 60 * 60 * 1000, });
        // Điều hướng người dùng đến trang home
        res.redirect('https://can-teen.vercel.app/home');
    });
    

    return app.use("/", router);
}

module.exports = initCheckAuthRoutes;