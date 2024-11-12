import React from 'react';
import './FooterPage.scss';
import Breadcrumb from '../../Header/Breadcrumb';

const Gift =()=> {

        const breadcrumbItems = [
            { label: 'Trang chủ', link: '/' },
            { label: 'Quà tặng tri ân', link: '/gift' },
        ]
        return (
            <div className="background-footerpage">
                <Breadcrumb items={breadcrumbItems} />
                <div className="footerpage-container">
                    <div className='title-footerpage'>QUÀ TẶNG TRI ÂN</div>
                    <div className='content-footerpage'>
                    Chương trình tri ân diễn ra vào ngày cuối tuần của tuần cuối hàng tháng <br/>

                    + Với mong muốn mang đến cho Quý khách hàng những sản phẩm chất lượng tốt nhất đồng thời đi kèm với dịch vụ tốt nhất và chính sách chăm sóc khách hàng tuyệt vời nhất.  <br/>

                    + Chương trình thẻ hội viên được xây dựng để tạo nên chính sách tri ân khách hàng đã tin chọn sản phẩm của chúng tôi. Quý khách mua sản phẩm sẽ được cộng dồn điểm tương ứng doanh số mua hàng với mỗi 100.000 VNĐ tương ứng với 1 điểm.<br/>

                    Điều kiện để trở thành khách hàng thân thiết trong chính sách tri ân khách hàng<br/>

                    + Có tổng giá trị các đơn hàng từ 500.000 VNĐ trở lên tại hệ thống và trực tiếp tại canteen.<br/>

                    + Cung cấp đầy đủ và chính xác thông tin cá nhân.<br/>

                    Dola xin thân tặng Quý khách hàng Chương trình ‘’ TRI ÂN KHÁCH HÀNG THÂN THIẾT ’’ như một lời tri ân sâu sắc cảm ơn sự tin yêu của quý khách dành cho Canteen.<br/>
                    </div>
                    <p className='title-footer'>Trân trọng cảm ơn.</p>
                </div>
            </div>

        )
}


export default Gift;
