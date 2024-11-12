import React, { useState, useEffect } from 'react';
import './news.scss';
import { Link } from 'react-router-dom';
import Breadcrumb from '../Header/Breadcrumb';
import { getNews } from '../../services/news-reviewsService';
import slugify from 'slugify';
import he from 'he';

const News = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);  // For loading state
    const [error, setError] = useState(null);  

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await getNews(); 
                setNewsList(response);
            } catch (error) {
                setError('Error fetching news');
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);
    
    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: 'Tin tức', link: '/news' },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='news-container'>
            <Breadcrumb items={breadcrumbItems} />
            <div className='news-content'>
                <div className='title-news'>Tin tức - Thông tin khuyến mãi</div>
                <div className="news-list">
                    {newsList && newsList.length > 0 ? (
                        newsList.map((news) => (
                            <div key={news.id} className="news-item">
                                {news.imageUrl ? (
                                    <img src={news.imageUrl} alt={news.title} className="news-img" />
                                ) : (
                                    <div>No image available</div>
                                )}
                                <div className="news-text">
                                    <h3>{news.title}</h3>
                                    <div className='news-nd'dangerouslySetInnerHTML={{ __html: `${he.decode(news.content).substring(0, 100)}...` }}></div>
                                    <Link to={`/news/${ slugify(news.title, { lower: true, strict: true, remove: /[^\w\s-]/g}).replace('djai', 'dai')}`} className='xemthem'>
                                        <div className="button-block">
                                            <span className="button-line-left"></span>
                                            <span className="button-text">Xem Thêm</span>
                                            <span className="button-line-right"></span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>Không có bài viết nào</div>
                    )}
                </div>
            </div>
        </div>     
    );
}

export default News;
