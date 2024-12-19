import jwt from 'jsonwebtoken';
import db from '../models/index';
const { Op } = require('sequelize');
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

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

const handleForgotPassword = async (req, res) => {
    const { email } = req.body;
  
    // Kiểm tra nếu người dùng tồn tại
    const user = await db.Users.findOne({ where: { email } , raw: false});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Tạo một token reset mật khẩu
    const resetToken = jwt.sign(
      { userId: user.id }, // Thông tin lưu trong token
      'secret-key', // Secret key dùng để mã hóa token
      { expiresIn: '1h' } // Token hết hạn sau 1 giờ
    );
  
    // Gửi email chứa liên kết reset mật khẩu
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetLink}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email' });
      }
      return res.status(200).json({ message: 'Reset password email sent' });
    });
};

const handleResetPassword = async (req, res) => {
  const { token } = req.params;
  const { newpassword } = req.body;

  try {
    // Giải mã token và lấy userId
    jwt.verify(token, 'secret-key', async (err, decoded) => {
      console.log(JSON.stringify(decoded));
      if (err) {
        return res.status(400).send('Token không hợp lệ hoặc đã hết hạn');
      }

      // Tìm người dùng theo userId từ decoded token
      const user = await db.Users.findByPk(decoded.userId, {raw: false});

      if (!user) {
        return res.status(404).send('Không tìm thấy người dùng');
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newpassword, 10);

      // Cập nhật mật khẩu mới trong cơ sở dữ liệu
      user.password = hashedPassword;

      // Lưu thay đổi vào cơ sở dữ liệu
      await user.save();

      res.status(200).send('Mật khẩu đã được thay đổi thành công');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Đã xảy ra lỗi, vui lòng thử lại');
  }
};


export default {
    handleCheckAuth: handleCheckAuth,
    handlelogout: handlelogout,
    handleForgotPassword: handleForgotPassword,
    handleResetPassword: handleResetPassword
};
