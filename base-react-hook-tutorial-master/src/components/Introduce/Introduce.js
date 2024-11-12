import React from 'react';
import './Introduce.scss';
import Breadcrumb from '../Header/Breadcrumb';

const Introduce =(props) => {
    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: 'Giới thiệu', link: '/introduce' },
    ]
    return (
        <div className="background-introduce">
            <Breadcrumb items={breadcrumbItems} />
            <div className="introduce-container">
                <div className='title-introduce'>GIỚI THIỆU</div>
                <div className='content-introduce'>
                     <p className='introduce'>
                        Canteen trường đại học không chỉ là nơi cung cấp các bữa ăn hàng ngày cho sinh viên, 
                        giảng viên và nhân viên trong khuôn viên trường, mà còn là một không gian sinh hoạt quan trọng trong đời sống sinh viên. 
                        Thực đơn tại canteen thường được thiết kế phong phú và đa dạng, nhằm đáp ứng nhu cầu ăn uống khác nhau của mọi người. 
                        Các món ăn truyền thống như cơm, bún, phở luôn có sẵn, bên cạnh đó là các món ăn nhanh như sandwich, bánh mì,..
                        và các loại đồ uống như trà sữa, cà phê, nước ép hoa quả.
                    </p>
                        
                    <div className='img-introduce1'></div>
                    <p className='introduce'>
                        Canteen không chỉ phục vụ các bữa ăn chính trong ngày, mà còn cung cấp những món ăn nhẹ, đồ ăn vặt giúp sinh viên có thể giải tỏa căng thẳng sau những giờ học căng thẳng. 
                        Ngoài ra, đây cũng là nơi lý tưởng để sinh viên gặp gỡ, trò chuyện với bạn bè.
                        Đối với giảng viên và nhân viên, canteen là nơi lý tưởng để thư giãn và nạp năng lượng trước khi tiếp tục công việc. 
                        Với một không gian mở, sạch sẽ, canteen còn tổ chức nhiều chương trình khuyến mãi, giảm giá đặc biệt dành cho sinh viên.
                    </p>
                    <div className='img-introduce2'></div>
                    <p className='introduce'>Canteen còn được trang bị các thiết bị hiện đại như hệ thống thanh toán không tiền mặt, đặt món qua ứng dụng di động, giúp sinh viên tiết kiệm thời gian xếp hàng và dễ dàng theo dõi đơn hàng của mình. </p>

                    <p className='introduce'>Canteen không chỉ đơn thuần là nơi ăn uống, mà còn là một phần không thể thiếu trong đời sống học đường, đóng vai trò quan trọng trong việc tạo nên sự gắn kết và phát triển tinh thần cộng đồng trong môi trường đại học.</p>
                </div>
                <div className='img-introduce3'></div>
                <p className='title-footer'>HÃY ĐẾN CANTEEN ĐỂ THƯỞNG THỨC NGAY BẠN NHÉ!</p>
            </div>
        </div>
    )
 }


export default Introduce;
