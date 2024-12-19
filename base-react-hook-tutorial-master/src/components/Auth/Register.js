import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.scss';
import Breadcrumb from '../Header/Breadcrumb';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerNewUser } from '../../services/userService';
import {checkAuth } from '../../services/checkAuth';

const Register = (props) => {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [fullname, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false); 
    const defaultValidIput = {
        isValidEmail: true,
        isValidPassword: true,
        isValidConfirmPassword: true
    }
    const[objCheckInput, setobjCheckInput] = useState(defaultValidIput);

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

    const handleShowHideConfirmPassword = () => {
        setIsShowConfirmPassword(!isShowConfirmPassword);
    };


    const isVallidInputs = () =>{
        if (!email) {
            setobjCheckInput({ ...defaultValidIput, isValidEmail: false })
            toast.error("Làm ơn nhập email.");
            return false;
        };
        let regx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if(!regx.test(email)){
            setobjCheckInput({ ...defaultValidIput, isValidEmail: false})
            toast.error("Email không hợp lệ.")
            return false;
        }
        if (!fullname) {
            toast.error("Làm ơn nhập full name.");
            return false;
        };       
        if (!password) {
            setobjCheckInput({ ...defaultValidIput, isValidPassword: false})
            toast.error("Làm ơn nhập password. ");
            return false;
        };
        if (password !== confirmPassword) {
            setobjCheckInput({ ...defaultValidIput, isValidConfirmPassword: false})
            toast.error("Mật khẩu không giống nhau.");
            return false;
        };  

        return true;
    }

    const handleRegister = async() => {
        let check = isVallidInputs();
        if (check === true) {
            try {
                let response = await registerNewUser(email, fullname, password);
                if (response.status === 200) {
                    toast.success("Đăng ký thành công!");
                    navigate('/login');
                } 
            } catch (error) {
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Có lỗi xảy ra, vui lòng thử lại.");
                }
            }
        }
    }

    const handlePressEnter =(event)=>{
        if(event.charCode === 13 && event.code === "Enter"){
           handleRegister()
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/auth/google'; // Redirect tới Google OAuth
    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:8080/auth/facebook'; // Redirect tới Facebook OAuth
    };

    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: 'Đăng kí', link: '/register' },
    ]
    return (
        <div className="register-background">
            <Breadcrumb items={breadcrumbItems} />
            <div className="register-container">
                <div className="register-content row">
                    <div className='col-12 text-register'>Đăng kí</div> 
                    <hr className="centered-line"/>
                    <div className='col-12form-group register-input'>
                        <input type="text" 
                        className={objCheckInput.isValidEmail ? "form-control input" : "form-control input is-invalid"}
                        placeholder="Email" 
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}  
                        required/>
                    </div>
                    <div className='col-12form-group register-input'>
                        <input type="text" 
                        className="form-control input" 
                        placeholder="Fullname" 
                        value={fullname}
                        onChange={(event) => setFullName(event.target.value)}  required/>
                    </div>
                    <div className='col-12 form-group register-input'>
                        <input 
                            type={isShowPassword ? "text" : "password"} 
                            className={objCheckInput.isValidPassword ? "form-control input" : "form-control input is-invalid"}
                            placeholder="Password" 
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required 
                        />
                        <span onClick={handleShowHidePassword}>
                            <i className={isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                        </span>
                    </div>

                    <div className='col-12 form-group register-input'>
                        <input 
                            type={isShowConfirmPassword ? "text" : "password"} 
                            className={objCheckInput.isValidConfirmPassword ? "form-control input" : "form-control input is-invalid"} 
                            placeholder="Password Again" 
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            onKeyPress={(event) => handlePressEnter(event)}
                            required 
                        />
                        <span onClick={handleShowHideConfirmPassword}>
                            <i className={isShowConfirmPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                        </span>
                    </div>
                    <div className='col-12'>
                        <button className='btn-register' onClick={() => handleRegister()}>Đăng kí</button>
                    </div>                        
                    <div className='col-12 text-center'>
                        <text className='have-account'>Bạn đã có tài khoản? <a className='login' href='/login'>Đăng nhập</a></text>
                    </div>
                    <div className='col-12 text-center'>
                        <span className='text-other-register'>Đăng nhập bằng cách khác:</span>
                    </div>
                    <div className='col-12 social-login'>
                    <i onClick={handleGoogleLogin} className="fab fa-google-plus-square google"></i>
                    <i onClick={handleFacebookLogin} className="fab fa-facebook-square facebook"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Register;
