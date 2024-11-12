import React from 'react';
import './Footer.scss';

const Footer = () =>{
    return (
        <footer className="footer-container">
            <div className="row footer-content">
                {/* Giới thiệu */}
                <div className="col-md-3 col-footer">
                    <h5>GIỚI THIỆU</h5>
                    <p>
                        Căn teen chúng tôi luôn luôn đặt khách hàng lên hàng đầu, tận tâm phục vụ,
                        mang lại cho khách hàng những trải nghiệm tuyệt vời nhất. Các món ăn tiện lợi nhưng
                        mang lại hương vị mới mẻ và nhanh chóng cho thực khách. Căn teen xin chân thành cảm ơn.
                    </p>
                </div>

                {/* Liên hệ trực tiếp */}
                <div className="col-md-3 col-footer">
                    <h5>LIÊN HỆ TRỰC TIẾP</h5>
                    <ul>
                        <li>Địa chỉ: 280 An Dương Vương, phường 4, quận 5, TPHCM</li>
                        <li>Điện thoại: 09112224</li>
                        <li>Email: support@canteen.hcmue.edu.vn</li>
                    </ul>
                </div>

                {/* Hướng dẫn */}
                <div className="col-6 col-md-4 col-lg-2 link-list col-footer-1">
                    <h5 className="title-menu">
                        HƯỚNG DẪN
                        <span className="Collapsible__Plus"></span>
                    </h5>
                    <ul>
                        <li><a href='/buying-guide'>Hướng dẫn mua hàng</a></li>
                        <li><a href='/payment-guide'>Hướng dẫn thanh toán</a></li>
                        <li><a href='/register'>Đăng ký thành viên</a></li>
                        <li><a href='/contact'>Hỗ trợ khách hàng</a></li>
                    </ul>
                </div>

                {/* Chính sách */}
                <div className="col-6 col-md-4 col-lg-2 link-list col-footer-1">
                    <h5>CHÍNH SÁCH</h5>
                     <ul>
                        <li><a href='/menber-policy'>Chính sách thành viên</a></li>
                        <li><a href='/payment-policy'>Chính sách thanh toán</a></li>
                        <li><a href='/gift'>Quà tặng tri ân</a></li>
                        <li><a href='/security'>Bảo mật thông tin</a></li>
                    </ul>
                </div>

                {/* Mạng xã hội và hình thức thanh toán */}
                <div className="col-md-2 socical-payment">
                    <div className='footer-social'>
                        <h5>MẠNG XÃ HỘI</h5>
                        <div className="social-icons">
                            <div className="facebook-icon"></div>
                        </div>
                    </div>
                    <div className='footer-payment'>
                        <h5>HÌNH THỨC THANH TOÁN</h5>
                        <div className="payment-icons">
                            <div className="payment1"></div>
                            <div className="payment2"></div>
                            <div className="payment3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>          
    );
}

export default Footer;