import React, { useState } from 'react';
import './Reservation.scss';
import Breadcrumb from '../Header/Breadcrumb';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createReservation } from '../../services/reser-contactService';

const Reservation = () => {
    const [email, setEmail] = useState("");
    const [fullname, setFullName] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [numberOfGuests, setNumberOfGuests] = useState("");
    const [reservationDate, setReservationDate] = useState("");
    const [reservationTime, setReservationTime] = useState("");
    const defaultValidIput = {
        isValidEmail: true,
        isValidPhoneNumber: true,
        isValidNumberOfGuests: true,
        isValidReservationDate: true,
        isValidReservationTime: true
    }
    const[objCheckInput, setobjCheckInput] = useState(defaultValidIput);

    const isVallidInputs = () =>{
        if (!fullname) {
            toast.error("Làm ơn nhập full name.");
            return false;
        };       
        if (!phonenumber || !/^\d+$/.test(phonenumber)) {
            setobjCheckInput({ ...defaultValidIput, isValidPhoneNumber: false})
            toast.error("Làm ơn nhập số điện thoại. ");
            return false;
        };
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
        if (!numberOfGuests) {
            setobjCheckInput({ ...defaultValidIput, isValidNumberOfGuests: false})
            toast.error("Làm ơn nhập số người đến.");
            return false;
        };  
        if (!reservationDate) {
            setobjCheckInput({ ...defaultValidIput, isValidReservationDate: false})
            toast.error("Làm ơn nhập ngày đặt bàn.");
            return false;
        }; 
        if (!numberOfGuests) {
            setobjCheckInput({ ...defaultValidIput, isValidReservationTime: false})
            toast.error("Làm ơn nhập thời gian đặt bàn.");
            return false;
        }; 

        return true;
    }

    const handleReservation = async() => {
        let check = isVallidInputs();
        if (check === true) {
            try {
                let response = await createReservation(fullname, phonenumber, email, numberOfGuests, reservationDate, reservationTime);
                if (response.message === 'Đặt bàn thành công') {
                    toast.success("Đặt bàn thành công!");
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
    }

    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: 'Đặt bàn', link: '/reservation' },
    ]
    return (
        <div className='reservation-container'>
            <Breadcrumb items={breadcrumbItems} />
            <div className="reservation-form-container">
                <h2>Liên hệ đặt bàn</h2>
                <hr className="centered-line"/>
                <div className='group_contact row' >
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
                        <label>Bạn đi mấy người:</label>
                        <input 
                        type="number" 
                        min = "1"
                        className={objCheckInput.isValidNumberOfGuests ? "numberOfGuests" : "numberOfGuests is-invalid"}  
                        value={numberOfGuests} 
                        onChange={(event) => setNumberOfGuests(event.target.value)}
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
            
                    <div className="form-group">
                        <label>Bạn có thể dùng ngày nào?</label>
                        <input 
                        type="date" 
                        className= {objCheckInput.isValidReservationDate ? "reservationDate"   : "reservationDate is-invalid"} 
                        value={reservationDate} 
                        onChange={(event) => setReservationDate(event.target.value)} 
                        required 
                        />
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
                        <label>Bạn có thể đến mấy giờ:</label>
                        <input 
                        type="time" 
                        className={objCheckInput.isValidReservationTime? "reservationTime"   : "reservationTime is-invalid"} 
                        value={reservationTime} 
                        onChange={(event) => setReservationTime(event.target.value)}
                        required 
                        />
                    </div>
                </div>
                <button type="submit" className="submit-button reser-btt" onClick={()=>handleReservation()}>
                    Đặt bàn ngay
                </button>
            </div>
        </div>     
    )
}

export default Reservation;