import React from 'react';
import './FooterPage.scss';
import Breadcrumb from '../../Header/Breadcrumb';

const PaymentPolicy =() => {

        const breadcrumbItems = [
            { label: 'Trang chủ', link: '/' },
            { label: 'Chính sách thanh toán', link: '/payment-policy' },
        ]
        return (
            <div className="background-footerpage">
                <Breadcrumb items={breadcrumbItems} />
                <div className="footerpage-container">
                    <div className='title-footerpage'>CHÍNH SÁCH THANH TOÁN</div>
                    <div className='content-footerpage'>
                    Khách hàng thanh toán trực tiếp tại cửa hàng <br/>

                    + Nhận ưu đãi<br/>

                    + Nhận quà tặng kèm<br/>

                    + Checkin tại cửa hàng<br/>

                    Khách hàng thanh toán online<br/>

                    + Quà tặng kèm bất kỳ<br/>

                    Khách hàng có nhu cầu khiếu nại, đổi trả sản phẩm do lỗi của Dola có thể liên hệ qua Hotline 1900 6750 để được hỗ trợ sớm nhất.<br/>

                    Tư vấn viên sẽ hướng dẫn khách hàng các bước cần thiết để tiến hành trả thanh toán.<br/>
                    </div>
                    <p className='title-footer'>Trân trọng cảm ơn.</p>
                </div>
            </div>

        )
}


export default PaymentPolicy;
