import React, { useState } from "react";
import './changePassword.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changePassword } from "../../services/userService"; 

const ChangePassword =(props)=>{
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowNewPassword, setIsShowNewPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShowHidePassword = () => {
        setIsShowPassword(!isShowPassword)
    }
    const handleShowHideNewPassword = () => {
        setIsShowNewPassword(!isShowNewPassword)
    }
    const handleShowHideConfirmPassword = () => {
        setIsShowConfirmPassword(!isShowConfirmPassword)
    }

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Tất cả các ô đều bắt buộc điền!");
            return;
        }
        if (currentPassword === newPassword) {
            toast.error("Mật khẩu mới và mật khẩu cũ phải khác nhau!");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
        setIsModalOpen(true);
    };

    const confirmUpdate=async () => {
        try {
            const response = await changePassword(currentPassword, newPassword);
            if (response.message === "Password changed successfully") {
                toast.success("Đổi mật khẩu thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            toast.error("Đổi mật khẩu không thành công. Vui lòng thử lại.");
        }finally {
            setIsModalOpen(false);
        }
    }

    const handlePressEnter =(event)=>{
        if(event.charCode === 13 && event.code === "Enter"){
            handleChangePassword()
        }
    }

    return (
        <div className="changePassword-profile">
            <h2 className="title-changePassword">Thay đổi mật khẩu</h2>
            <h3 className="title1-changePassword">Để đảm bảo tính bảo mật yêu cầu đặt mật khẩu ít nhất 8 kí tự</h3>
            <div className="form-changePassword">
            <div className="form-group">
                    <label>Mật khẩu hiện tại:<span style={{ color: 'red' }}>*</span></label>
                    <input 
                        type={isShowPassword ? "text" : "password"} 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        required
                    />
                    <span onClick= {() => handleShowHidePassword()}>                                      
                        <i className={isShowPassword ? "fas fa-eye": "fas fa-eye-slash"}></i>
                    </span>
                </div>
                <div className="form-group">
                    <label>Mật khẩu mới:<span style={{ color: 'red' }}>*</span></label>
                    <input 
                        type={isShowNewPassword ? "text" : "password"} 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required
                    />
                    <span onClick= {() => handleShowHideNewPassword()}>                                      
                        <i className={isShowNewPassword ? "fas fa-eye": "fas fa-eye-slash"}></i>
                    </span>
                </div>
                <div className="form-group">
                    <label>Xác nhận mật khẩu mới:<span style={{ color: 'red' }}>*</span></label>
                    <input 
                        type={isShowConfirmPassword ? "text" : "password"}
                        value={confirmPassword} 
                        onKeyPress={(event) => handlePressEnter(event)}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required
                    />
                    <span onClick= {() => handleShowHideConfirmPassword()}>                                      
                        <i className={isShowConfirmPassword ? "fas fa-eye": "fas fa-eye-slash"}></i>
                    </span>
                </div>
                <button type="submit" onClick={()=>handleChangePassword()}>Đổi mật khẩu</button>
            </div>
            {isModalOpen && (
                <div className="modal">
                <div className="modal-content">
                    <h3>Xác nhận cập nhật thông tin</h3>
                    <p>Bạn có chắc chắn muốn cập nhật thông tin không?</p>
                    <div className="button-container">
                        <button onClick={confirmUpdate}>Xác nhận</button>
                        <button onClick={() => setIsModalOpen(false)}>Hủy</button>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}
export default ChangePassword;