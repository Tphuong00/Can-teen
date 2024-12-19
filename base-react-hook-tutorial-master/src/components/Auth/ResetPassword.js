import React, { useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from "../../services/userService"; // Giả sử bạn có một service cho API reset
import "./ResetPassword.scss";
import Breadcrumb from '../Header/Breadcrumb';

const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false); 

    const handleShowHidePassword = () => {
        setIsShowPassword(!isShowPassword)
    }
    const handleShowHideConfirmPassword = () => {
        setIsShowConfirmPassword(!isShowConfirmPassword);
    };

    const handleSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ mật khẩu.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            console.log(newPassword);
            const response = await resetPassword(resetToken, newPassword);
            console.log(response);
            if (response) {
                toast.success("Mật khẩu đã được thay đổi thành công.");
                navigate('/login'); // Chuyển hướng người dùng đến trang đăng nhập
            }
        } catch (error) {
            toast.error(error.message || "Đã xảy ra lỗi!");
        }
    };

    const handlePressEnter =(event)=>{
        if(event.charCode === 13 && event.code === "Enter"){
            handleSubmit()
        }
    }

    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: 'Cập nhật lại mật khẩu', link: '/reset-password' },
    ]

    return (
        <div className="reset-password-container">
            <Breadcrumb items={breadcrumbItems} />
            <div className="reset-password-content">
                <div className='title-resetpassword'>Đặt lại mật khẩu</div>
                <hr className="centered-line"/>
                
                    <div className='form-group-reset'>
                        <div className='password-name'>Nhập mật khẩu mới:</div>
                        <div className='password-group'> 
                            <input 
                                className='input-password'
                                type={isShowPassword ? "text" : "password"}
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                
                            />
                            <span onClick= {() => handleShowHidePassword()}>                                                           
                                <i className={isShowPassword ? "fas fa-eye": "fas fa-eye-slash"}></i>
                            </span>
                        </div>
                        <div className='password-name'>Xác nhận lại mật khẩu mới:</div>
                        <div className='password-group'>
                            <input 
                                className='input-password'
                                type={isShowConfirmPassword ? "text" : "password"} 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                onKeyPress={(event) => handlePressEnter(event)}
                            />
                            <span onClick= {() => handleShowHideConfirmPassword()}>                                                           
                                <i className={isShowConfirmPassword ? "fas fa-eye": "fas fa-eye-slash"}></i>
                            </span>
                        </div>
                        <button className='btn-reserpassword' onClick={handleSubmit}>Đặt lại mật khẩu</button>
                    </div>
            </div>
        </div>
    );
};

export default ResetPassword;
