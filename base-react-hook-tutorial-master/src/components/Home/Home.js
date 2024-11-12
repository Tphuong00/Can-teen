import React from 'react';
import {Link} from 'react-router-dom';
// import Event from './Section/event';
import './Home.scss';

const HomePage = () => {
    return (
        <React.Fragment>
            <div className='home-header-banner'>
                <div className='title1'>CĂN TEEN TRƯỜNG ĐẠI HỌC SƯ PHẠM</div>
                <div className='title2'>Món ăn đa dạng, phù hợp với trường học</div>
            </div>
            <div className='home-center'>
                <div className='center-right'>
                    <div className='title-center'>Về chúng tôi</div>
                    <p>
                        Canteen trường đại học là nơi phục vụ các bữa ăn cho sinh viên,
                        giảng viên và nhân viên trong khuôn viên trường. Thực đơn ở canteen thường đa dạng, bao gồm cơm, bún, phở,
                        các món ăn nhanh và đồ uống. Đây cũng là nơi rộng rãi mà sinh viên có thể nghỉ ngơi, ăn uống và
                        trò chuyện với bạn bè giữa các giờ học.
                    </p>
                    <Link to="/introduce" className="xemthem" title="xem thêm">
                        <div className="button-block">
                            <span className="button-line-left"></span>
                            <span className="button-text">Xem Thêm</span>
                            <span className="button-line-right"></span>
                        </div>
                    </Link>
                </div>
                <div className='center-left'>
                    <div className='picture'></div>
                </div>
            </div>
            {/* <Event/> */}
        </React.Fragment>
    );
};

export default HomePage;
