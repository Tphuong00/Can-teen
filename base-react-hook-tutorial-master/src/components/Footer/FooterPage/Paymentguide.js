import React from 'react';
import './FooterPage.scss';
import Breadcrumb from '../../Header/Breadcrumb';

const PaymentGuide =() => {
    
        const breadcrumbItems = [
            { label: 'Trang chủ', link: '/' },
            { label: 'Hướng dẫn thanh toán', link: '/payment-guide' },
        ]
        return (
            <div className="background-footerpage">
                <Breadcrumb items={breadcrumbItems} />
                <div className="footerpage-container">
                    <div className='title-footerpage'>HƯỚNG DẪN THANH TOÁN</div>
                    <div className='content-footerpage'>
                    Lựa chọn thông tin tài khoản thanh toán <br/>

                    Nếu bạn đã có tài khoản vui lòng nhập thông tin tên đăng nhập là username và mật khẩu vào mục đã có tài khoản trên hệ thống<br/>

                    Nếu bạn chưa có tài khoản và muốn đăng ký tài khoản vui lòng điền các thông tin cá nhân để tiếp tục đăng ký tài khoản. Khi có tài khoản bạn sẽ dễ dàng theo dõi được đơn hàng của mình<br/>

                    + Điền các thông tin của bạn để nhận đơn hàng, lựa chọn hình thức thanh toán khi nhận hàng, chuyển khoản và vận chuyển, lấy hàng tại canteen cho đơn hàng của mình<br/>

                    + Xem lại thông tin đặt hàng, điền chú thích và gửi đơn hàng
                    </div>
                    <p className='title-footer'>Trân trọng cảm ơn.</p>
                </div>
            </div>

        )
}


export default PaymentGuide;
