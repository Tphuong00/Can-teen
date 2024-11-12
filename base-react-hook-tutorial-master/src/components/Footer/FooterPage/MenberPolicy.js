import React from 'react';
import './FooterPage.scss';
import Breadcrumb from '../../Header/Breadcrumb';

const MenberPolicy=() =>{

        const breadcrumbItems = [
            { label: 'Trang chủ', link: '/' },
            { label: 'Chính sách thành viên', link: '/menber-policy' },
        ]
        return (
            <div className="background-footerpage">
                <Breadcrumb items={breadcrumbItems} />
                <div className="footerpage-container">
                    <div className='title-footerpage'>CHÍNH SÁCH THÀNH VIÊN</div>
                    <div className='content-footerpage'>
                    Điều kiện chính sách thành viên <br />
                    1. Thẻ thành viên<br />
                    Điều kiện cấp thẻ thành viên: Khi khách hàng mua hàng trên hệ thống sẽ được cấp thẻ thành viên.<br />
                    2. Thẻ VIP<br />
                    Điều kiện nhận thẻ VIP:<br />
                    + Có giá trị tổng đơn hàng lớn hơn 800.000 đồng/ tháng<br />
                    + Mua hàng với giá trị 50.000 đồng trợ lên<br />
                    + Tham gia các hoạt động, chương trình khuyến mãi của Canteen<br />
                    </div>
                    <p className='title-footer'>Trân trọng cảm ơn.</p>
                </div>
            </div>

        )
}


export default MenberPolicy;
