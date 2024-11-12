import React, { useEffect } from "react";
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileInfo from './profileInfo';
import ChangePassword from './changePassword';
import OrderHistory from './orderHistory';
import './profile.scss';
import Breadcrumb from '../Header/Breadcrumb';
import {checkAuth } from '../../services/checkAuth';

const Profile = () => {
    const location = useLocation();
    let navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await checkAuth(); // Gọi API checkAuth
                // Chuyển hướng đến trang đăng nhập nếu không xác thực
                if (!response || response.message !== "Authenticated successfully") {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra xác thực:", error);
                navigate("/login");
            }
        };

        checkLoginStatus();  
    }, [navigate]);

    // Xác định đường dẫn hiện tại để cập nhật breadcrumb
    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
    ];

    if (location.pathname.startsWith('/profile')) {
        breadcrumbItems.push({ label: 'Thông tin tài khoản' });
    }else if (location.pathname.startsWith('/profile/orderHistory')) {
        breadcrumbItems.push({ label: 'Đơn hàng của bạn' });
    } else if (location.pathname.startsWith('/profile/changePassword')) {
        breadcrumbItems.push({ label: 'Đổi mật khẩu' });
    }
    
    return (
        <div className="profile-container">
            <Breadcrumb items={breadcrumbItems} />
            <div className="profile-primary">
                {/* Khung điều hướng bên trái */}
                <div className="profile-sidebar">
                    <h3 className='profile-title1'>TRANG TÀI KHOẢN</h3>
                    <div className='profile-items'>
                        <li><Link to="/profile">Thông tin tài khoản</Link></li>
                        <li><Link to="/profile/orderHistory">Đơn hàng của bạn</Link></li>
                        <li><Link to="/profile/changePassword">Đổi mật khẩu</Link></li>
                    </div>
                </div>

                {/* Nội dung hiển thị bên phải */}
                <div className="profile-content">
                    <Routes>
                        <Route path="/" element={<ProfileInfo />} />
                        <Route path="changePassword" element={<ChangePassword />} />
                        <Route path="orderHistory" element={<OrderHistory />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Profile;
