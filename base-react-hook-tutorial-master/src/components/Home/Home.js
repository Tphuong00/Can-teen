import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './Home.scss';
import { getNews } from '../../services/news-reviewsService';
import { getProducts } from '../../services/productService';
import FormSubcriber from './FormSubcribe';
import slugify from 'slugify';
import Slider from "react-slick"; // Importing slick-carousel for the slider

// Import styles for the slick-carousel
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const HomePage = () => {
    const [news, setNews] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        // Fetching tin tức
        const fetchNews = async () => {
            try {
                const response = await getNews();
                setNews(response);
            } catch (error) {
                console.error("Lỗi khi tải tin tức:", error);
            }
        };

        // Fetching sản phẩm nổi bật
        const fetchFeaturedProducts = async () => {
            try {
                const response = await getProducts();
                setFeaturedProducts(response);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };

        fetchNews();
        fetchFeaturedProducts();
    }, []);

    const cardSliderSettings = {
        infinite: true,   // Cho phép vòng lặp vô hạn
        slidesToShow: 4,   // Số card hiển thị cùng lúc
        slidesToScroll: 1, // Số lượng card cuộn mỗi lần
        centerMode: false, // Không sử dụng chế độ center để tránh lệch
        focusOnSelect: true,
        arrows: true,      // Hiển thị mũi tên điều hướng
        dots: true,        // Hiển thị dots điều hướng
        responsive: [
            {
                breakpoint: 1024,  // Khi chiều rộng nhỏ hơn 1024px
                settings: {
                    slidesToShow: 2, // Hiển thị 2 card
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,  // Khi chiều rộng nhỏ hơn 768px
                settings: {
                    slidesToShow: 1, // Hiển thị 1 card
                    slidesToScroll: 1,
                },
            },
        ],
    };


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

            <div className="news-slider">
                <div className ="slide-container">
                    <h2>Tin tức mới nhất</h2>
                    <Slider {...cardSliderSettings}>
                        {news.length > 0 ? (
                            news.map((item) => (
                            <div key={item.id} className="card-item">
                                <img src={item.imageUrl} alt={item.title} />
                                <div className="card-content">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <Link to={`/news/${ slugify(item.title, { lower: true, strict: true, remove: /[^\w\s-]/g}).replace('djai', 'dai')}`} className="read-more">
                                    Đọc thêm
                                </Link>
                                </div>
                            </div>
                            ))
                        ) : (
                            <p>Chưa có tin tức mới</p>
                        )}
                </Slider>
                </div>
            </div>

            <div className="product-slider">
                <div className ="slide-container">
                    <h2>Thực đơn của chúng tôi</h2>
                    <Slider {...cardSliderSettings}>
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((item) => (
                            <div key={item.id} className="card-item">
                                <div className="product-image">
                                    <img src={item.imageUrl} alt={item.itemName} />
                                </div>

                                <h3>{item.itemName}</h3>
                                <p className="price-section">
                                    {item.discount ? (
                                    <>
                                    <span className="price discounted">
                                        {Number(item.originalPrice).toLocaleString('vi-VN')}đ
                                    </span>
                                    <span className="price">{Number(item.price).toLocaleString('vi-VN')}đ</span>
                                    </>
                                    ) : (
                                        <span className="price">{Number(item.price).toLocaleString('vi-VN')}đ</span>
                                    )}
                                </p>
                                <Link
                                    to={`/${slugify(item.itemName, { lower: true, strict: true, remove: /[^\w\s-]/g }).replace('djai', 'dai')}`}
                                    className="buy-now-button"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                            ))
                        ) : (
                            <p>Chưa có sản phẩm nổi bật</p>
                        )}
                    </Slider>
                </div>
            </div>
            <FormSubcriber/>
        </React.Fragment>
    );
};

export default HomePage;
