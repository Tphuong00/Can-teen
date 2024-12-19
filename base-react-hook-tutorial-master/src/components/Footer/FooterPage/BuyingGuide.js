import React from 'react';
import './FooterPage.scss';
// import { FormattedMessage } from 'react-intl';
import Breadcrumb from '../../Header/Breadcrumb';

const BuyingGuide= ()=> {
        const breadcrumbItems = [
            { label: 'Trang chủ', link: '/' },
            { label: 'Hướng dẫn mua hàng', link: '/buying-guide' },
        ]
        return (
            <div className="background-footerpage">
                <Breadcrumb items={breadcrumbItems} />
                <div className="footerpage-container">
                    <div className='title-footerpage'>HƯỚNG DẪN MUA HÀNG</div>
                    <div className='content-footerpage'>
                    - Bước 1: Truy cập website và lựa chọn món ăn cần mua<br/>

                    - Bước 2: Click và sản phẩm muốn mua, màn hình hiển thị ra pop up với các lựa chọn sau<br/>

                    Nếu bạn muốn tiếp tục mua hàng: Bấm vào phần tiếp tục mua hàng để lựa chọn thêm sản phẩm vào giỏ hàng<br/>

                    Nếu bạn muốn xem giỏ hàng để cập nhật sản phẩm: Bấm vào xem giỏ hàng<br/>

                    Nếu bạn muốn đặt hàng và thanh toán cho sản phẩm này vui lòng bấm vào: Đặt hàng và thanh toán<br/>

                    - Bước 3: Lựa chọn thông tin tài khoản thanh toán<br/>

                    Nếu bạn đã có tài khoản vui lòng nhập thông tin tên đăng nhập là username và mật khẩu vào mục đã có tài khoản trên hệ thống<br/>

                    Nếu bạn chưa có tài khoản và muốn đăng ký tài khoản vui lòng điền các thông tin cá nhân để tiếp tục đăng ký tài khoản. Khi có tài khoản bạn sẽ dễ dàng theo dõi được đơn hàng của mình<br/>

                    - Bước 4: Điền các thông tin của bạn để nhận đơn hàng, lựa chọn hình thức thanh toán và vận chuyển cho đơn hàng của mình<br/>
                    Lưu ý: Vận chuyển để đơn hàng chất lượng nhất chỉ giao các quận 1,3,5,10,11,4,8<br/>

                    - Bước 5: Xem lại thông tin đặt hàng, điền chú thích và gửi đơn hàng<br/>
                    </div>
                    <p className='title-footer'>Trân trọng cảm ơn.</p>
                </div>
            </div>
    )
}


export default BuyingGuide;
