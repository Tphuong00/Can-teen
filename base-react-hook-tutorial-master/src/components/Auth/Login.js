import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../Header/Breadcrumb';
import {Modal} from 'react-bootstrap';
import './Login.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser, forgotPassword } from "../../services/userService";
import {checkAuth } from '../../services/checkAuth';
import { useCart } from '../Cart/CartContext';


const Login =(props)=>{
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const defaultValidIput = {
        isValidEmail: true,
        isValidPassword: true,
    }
    const[objCheckInput, setobjCheckInput] = useState(defaultValidIput);
    const [emailForgotPassword, setEmailForgotPassword] = useState(""); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { login } = useCart();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const response = await checkAuth(); // Gọi API checkAuth
            if (response && response.message === "Authenticated successfully") {
                navigate("/profile");
            }
        };
    
        checkLoginStatus(); 
    }, [navigate]);

    const handleShowHidePassword = () => {
        setIsShowPassword(!isShowPassword)
    }

    const handleLogin = async () => {
        if (!email) {
            setobjCheckInput({ ...defaultValidIput, isValidEmail: false })
            toast.error("Làm ơn nhập email.");
            return ;
        };       
        if (!password) {
            setobjCheckInput({ ...defaultValidIput, isValidPassword: false})
            toast.error("Làm ơn nhập password. ");
            return;
        };

        try {
            let response = await loginUser(email, password)
            if(response.status === 200){
                let data = {
                    isAuthenticated: true,
                    token: response.token,
                }
                // sessionStorage.setItem('token', JSON.stringify(data));
            }
            toast.success("Đăng nhập thành công!") 
                        
            login();
            // navigate('/home')
            window.location.reload(navigate('/home'));    
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
            toast.error(error.message || "Đăng nhập thất bại!");
            }
        }
     }

    const handlePressEnter =(event)=>{
        if(event.charCode === 13 && event.code === "Enter"){
           handleLogin()
        }
    }

    // Hàm xử lý form quên mật khẩu
    const handleForgotPassword = async () => {
        if (!emailForgotPassword) {
            toast.error('Vui lòng nhập email.');
            return;
        }
        try {
             await forgotPassword(emailForgotPassword);
            toast.success('Email reset mật khẩu đã được gửi!');
            setIsModalOpen(false); // Đóng modal sau khi gửi yêu cầu thành công
        } catch (error) {
            toast.error(error.message || 'Đã xảy ra lỗi khi gửi yêu cầu quên mật khẩu.');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'https://canteen-backend-production.up.railway.app/auth/google'; // Redirect tới Google OAuth
    };

    const handleFacebookLogin = () => {
        window.location.href = 'https://canteen-backend-production.up.railway.app/auth/facebook'; // Redirect tới Facebook OAuth
    };
    
    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: 'Đăng nhập', link: '/login' },
    ]

    return (
        <div className="login-background">
            <Breadcrumb items={breadcrumbItems} />
            <div className="login-container">
                <div className="login-content row">
                    <div className='col-12 text-login'>Đăng nhập</div> 
                    <hr className="centered-line"/>
                    <div className='col-12form-group login-input'>
                        <input type="text" 
                        className={objCheckInput.isValidEmail ? "form-control input" : "form-control input is-invalid"} 
                        placeholder="Email" 
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}  
                        rules={[{ required: true, message: 'Please input your email!' }]}/>
                    </div>
                    <div className='col-12form-group login-input'>
                        <input type={isShowPassword ? "text" : "password"} 
                        className={objCheckInput.isValidPassword ? "form-control input" : "form-control input is-invalid"} 
                        placeholder="Password" 
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onKeyPress={(event) => handlePressEnter(event)}
                        required/>
                        <span onClick= {() => handleShowHidePassword()}>
                                                            
                            <i className={isShowPassword ? "fas fa-eye": "fas fa-eye-slash"}></i>
                        </span>
                    </div>
                    <div className='col-12'>
                        <button className='btn-login' onClick={() => handleLogin()}>Login</button>
                    </div>                        
                    <div className='col-12 text-center'>
                        <span className='forgot-password' onClick={() => setIsModalOpen(true)}>Quên mật khẩu?</span>
                    </div>
                    <div className='col-12 text-center'>
                        <text className='no-account'>Bạn chưa có tài khoản? <a className='sign-up' href="/register">Đăng kí</a></text>
                    </div>
                    <div className='col-12 text-center'>
                        <span className='text-other-login'>Đăng nhập bằng cách khác:</span>
                    </div>
                    <div className='col-12 social-login'>
                        <i onClick={handleGoogleLogin} className="fab fa-google-plus-square google"></i>
                        <i onClick={handleFacebookLogin} className="fab fa-facebook-square facebook"></i>
                    </div>
                </div>
                <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} className="custom-modal">
                    <Modal.Header closeButton>
                        <Modal.Title className="title-forgot">Quên mật khẩu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={emailForgotPassword}
                                onChange={(e) => setEmailForgotPassword(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group-button">
                            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Đóng</button>
                            <button className="btn-send" onClick={handleForgotPassword}>Gửi yêu cầu lấy lại mật khẩu</button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}
export default Login;