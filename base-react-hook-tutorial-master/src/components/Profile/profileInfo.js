import React, { useState, useEffect } from "react";
import './profileInfo.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UpdateUser, getUserInfo } from "../../services/userService";

const ProfileInfo = (props) => {
    const [email, setEmail] = useState();
    const [fullname, setFullname] = useState();
    const [address, setAddress] = useState();
    const [phonenumber, setPhonenumber] = useState();
    const [roleID, setRoleID] = useState();
    const roleIdMap = {
        "nhân viên": 1,
        "sinh viên": 2,
        "khác": 3
    };
    const numericRoleID = roleIdMap[roleID];
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await getUserInfo();
                if (response && response.email) {
                    const { email, fullname, address, phonenumber, roleID } = response;
                    setEmail(email);
                    setFullname(fullname);
                    setAddress(address);
                    setPhonenumber(phonenumber);
                    const roleIdMap = {
                        1: "nhân viên",
                        2: "sinh viên",
                        3: "khác"
                    };
                    setRoleID(roleIdMap[roleID]);
                } 
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
                toast.error("Không thể tải thông tin người dùng.");
            }
        };

        fetchUserInfo();
    }, []); 

    const handleUpdate = () => {   
        if (roleID && numericRoleID === undefined) {
            toast.error("Vai trò không hợp lệ.");
            return;
        }
        setIsModalOpen(true);
    };

    const confirmUpdate = async () => {
        try {
            if (numericRoleID === undefined) {
                toast.error("Vai trò không hợp lệ.");
                return;
            }
            const response = await UpdateUser(email, fullname, address, phonenumber, numericRoleID);
            if (response.message === "User updated successfully") {
                toast.success("Thông tin đã được cập nhật thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            toast.error("Cập nhật không thành công. Vui lòng thử lại.");
        } finally {
            setIsModalOpen(false);
        }
    }

    return (
        <div className="update-profile">
            <h2 className="title-update">Thông tin tài khoản</h2>
            <div className="form-update">
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={email} readOnly />
                </div>
                <div className="form-group">
                    <label>Họ và tên:</label>
                    <input 
                        type="text" 
                        value={fullname} 
                        onChange={(e) => setFullname(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Số điện thoại:</label>
                    <input
                        type="text" 
                        value={phonenumber} 
                        onChange={(e) => setPhonenumber(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Địa chỉ:</label>
                    <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Vai trò:</label>
                    <select 
                        value={roleID} 
                        onChange={(e) => setRoleID(e.target.value)}
                    >
                        <option selected>Vui lòng chọn vai trò</option>
                        <option value="nhân viên">Nhân viên</option>
                        <option value="sinh viên">Sinh viên</option>
                        <option value="khác">Khác</option>
                    </select>
                </div>
                <button type="submit" onClick={()=>handleUpdate()}>Cập nhật thông tin</button>
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
    );
};

export default ProfileInfo;
