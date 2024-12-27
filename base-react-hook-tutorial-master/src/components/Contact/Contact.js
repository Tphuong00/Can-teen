import React, { useState } from 'react';
import './Contact.scss';
import Breadcrumb from '../Header/Breadcrumb';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createContact } from '../../services/reser-contactService';

const Contact = () => {
    const [email, setEmail] = useState("");
    const [fullname, setFullName] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");

    const defaultValidInput = {
        isValidEmail: true,
        isValidPhoneNumber: true,
        isValidMessage: true,
    };
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    const isValidInputs = () => {
        if (!fullname) {
            toast.error("Làm ơn nhập họ tên.");
            return false;
        }
        if (!phonenumber || !/^\d+$/.test(phonenumber)) {
            setObjCheckInput({ ...defaultValidInput, isValidPhoneNumber: false });
            toast.error("Làm ơn nhập số điện thoại hợp lệ.");
            return false;
        }
        if (!email) {
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            toast.error("Làm ơn nhập email.");
            return false;
        }
        const regx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (!regx.test(email)) {
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            toast.error("Email không hợp lệ.");
            return false;
        }
        if (!message) {
            setObjCheckInput({ ...defaultValidInput, isValidMessage: false });
            toast.error("Làm ơn nhập nội dung.");
            return false;
        }
        return true;
    };

    const handleContact = async () => {
        const check = isValidInputs();
        if (check) {
            try {
                const response = await createContact(fullname, email, phonenumber,  message);
                console.log(response.status);
                if (response.message === 'Gửi thông tin thành công') {
                    toast.success("Gửi thông tin thành công!");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Có lỗi xảy ra, vui lòng thử lại.");
                }
            }
        }
    };

    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: 'Liên hệ', link: '/contact' },
    ];

    return (
        <div className ='contact-container'>
            <Breadcrumb items={breadcrumbItems} />
            <div className ='contact-primary'>
                <div className ='contact-offline'>
                    <div className ='contact-title1'>Thông tin liên hệ</div>
                    <div className ='contact-info'>
                        <div className='icon-title'><i className ="fas fa-map-marker-alt"/>280 An Dương Vương, P4, Q5, TPHCM</div> 
                        <div className='icon-title'><i className ="fas fa-phone"/> 09112224</div> 
                        <div className='icon-title'><i className ="fas fa-envelope"/>support@canteen.hcmue.edu.vn</div> 
                    </div>
                </div>
                <div className ="contact-form-container">
                    <h2>LIÊN HỆ VỚI CHÚNG TÔI</h2>
                    <h4 className='contact-note'>
                        Bạn hãy điền nội dung tin nhắn vào form dưới đây và gửi cho chúng tôi.
                        Chúng tôi sẽ trả lời và liên hệ với bạn sau khi nhận và xử lý.
                    </h4>
                    <div className ='group_contact row'>
                        <div className="form-group">
                            <label>Tên của bạn:</label>
                            <input 
                            type="text" 
                            className="fullname" 
                            value={fullname} 
                            onChange={(event) => setFullName(event.target.value)}
                            required 
                            />
                    </div>
                        <div className="form-group">
                            <label>Số điện thoại:</label>
                            <input 
                            type="phone" 
                            className={objCheckInput.isValidPhoneNumber ? "phonenumber"  : "phonenumber is-invalid"} 
                            value={phonenumber} 
                            onChange={(event) => setPhoneNumber(event.target.value)}
                            required 
                            />
                        </div>       
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            className={objCheckInput.isValidEmail ? "form-control input" : "form-control input is-invalid"} 
                            value={email} 
                            onChange={(event) => setEmail(event.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Nội dung</label>
                        <textarea  
                            className={objCheckInput.isValidMessage ? "input-message" : "input-message is-invalid"} 
                            value={message} 
                            onChange={(event) => setMessage(event.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="submit-button contact-btt" onClick={()=>handleContact()}>Gửi thông tin</button>
                </div>
            </div>    
        </div>
    );
};

export default Contact;
