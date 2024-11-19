import React, { useState } from 'react';
import './starRating.scss';

const StarRating = ({ rating, readOnly = false, setRating, totalRatings = 0, distribution = {} }) => {
    const [hoveredRating, setHoveredRating] = useState(null); // Lưu rating khi hover

    // Xử lý sao đầy, nửa sao, và sao rỗng
    const fullStars = Math.floor(hoveredRating ?? rating); // Số sao đầy
    const hasHalfStar = (hoveredRating ?? rating) % 1 >= 0.5; // Kiểm tra có nửa sao không
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Số sao rỗng

    const stars = [];

    // Thêm sao đầy
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <i
                key={`full-${i}`}
                className="fas fa-star full-star"
                onClick={() => !readOnly && setRating(i + 1)} // Cập nhật rating khi nhấp
                onMouseEnter={() => !readOnly && setHoveredRating(i + 1)} // Di chuột để sáng sao
                onMouseLeave={() => setHoveredRating(null)} // Rời chuột sẽ trở lại trạng thái ban đầu
            ></i>
        );
    }

    // Thêm nửa sao (nếu có)
    if (hasHalfStar) {
        stars.push(
            <i
                key="half"
                className="fas fa-star-half-alt half-star"
                onClick={() => !readOnly && setRating(fullStars + 0.5)} // Cập nhật rating khi nhấp vào nửa sao
                onMouseEnter={() => !readOnly && setHoveredRating(fullStars + 0.5)} // Di chuột qua nửa sao
                onMouseLeave={() => setHoveredRating(null)}
            ></i>
        );
    }

    // Thêm sao rỗng
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <i
                key={`empty-${i}`}
                className="far fa-star empty-star"
                onClick={() => !readOnly && setRating(fullStars + (hasHalfStar ? 0.5 : 0))} // Cập nhật rating khi nhấp
                onMouseEnter={() => !readOnly && setHoveredRating(fullStars + (hasHalfStar ? 0.5 : 0))} // Di chuột qua sao rỗng
                onMouseLeave={() => setHoveredRating(null)}
            ></i>
        );
    }

    return (
        <div className="star-rating-container">
            <div className="rating-summary">
                <div className="average-rating">
                    <span className="rating-score">{(hoveredRating ?? rating).toFixed(1)}</span>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= rating ? 'star filled' : 'star'}
                                onClick={() => !readOnly && setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StarRating;
