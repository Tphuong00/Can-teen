import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNewsDetail } from '../../services/news-reviewsService'; // Hàm này sẽ gọi API lấy chi tiết bài viết
import Breadcrumb from '../Header/Breadcrumb';
import './newsDetail.scss';
const NewsDetail = () => {
    const { slug } = useParams(); // Lấy slug từ URL
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const response = await getNewsDetail(slug); // Lấy chi tiết bài viết
                console.log(response)
                setNews(response);
            } catch (error) {
                console.error('Error fetching news detail:', error);
                setError('Lỗi khi tải chi tiết bài viết');
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [slug]); // Gọi lại khi slug thay đổi

    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: 'Tin tức', link: '/news' },
        { label: news ? news.title: 'chi tiết bài viết', link: '' },
    ];

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="NewsDetail-container">
            <Breadcrumb items={breadcrumbItems} />
            {news && (
                <div className="news-detail">
                    <h1>{news.title}</h1>
                    <div className="news-time"> <i class="far fa-clock">
                        {new Date(news.createdAt).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })}</i>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: news.content }} />
                    {/* Hiển thị nội dung HTML nếu có */}
                </div>
            )}
        </div>
    );
};

export default NewsDetail;
