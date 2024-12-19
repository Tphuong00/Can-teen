import React from "react";
import './orderHistory.scss';
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { loginUser } from "../../services/userService";
// import {checkAuth } from '../../services/checkAuth';

const orderHistory =(props)=>{
    
    

    return (
        <div className="order-history">
            <div className="title-orderhistory">ĐƠN HÀNG CỦA BẠN</div>
            <table className="order-table">
                <thead>
                <tr>
                    <th>Đơn hàng</th>
                    <th>Ngày</th>
                    <th>Địa chỉ</th>
                    <th>Giá trị đơn hàng</th>
                    <th>TT thanh toán</th>
                    <th>TT vận chuyển</th>
                </tr>
                </thead>
                {/* <tbody>
                {orders && orders.length > 0 ? (
                    orders.map((order, index) => (
                    <tr key={index}>
                        <td>{order.orderId}</td>
                        <td>{order.date}</td>
                        <td>{order.address}</td>
                        <td>{order.total}</td>
                        <td>{order.paymentStatus}</td>
                        <td>{order.shippingStatus}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="6" className="no-orders">
                        Không có đơn hàng nào
                    </td>
                    </tr>
                )}
                </tbody> */}
            </table>
        </div>
    )
}
export default orderHistory;