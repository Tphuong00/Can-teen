import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetail, getRelatedProducts } from '../../services/productService';
import { submitReview, getReview } from '../../services/news-reviewsService';
import Breadcrumb from '../Header/Breadcrumb';
import StarRating from '../Review/starRating';
import './productDetail.scss';
import { toast } from 'react-toastify';
import { checkAuth } from '../../services/checkAuth';
import { addToCart } from '../../services/cartService';
import { useCart } from '../Cart/CartContext';
import {addToLikelist} from '../../services/likelistService';

const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]); // Khởi tạo như một mảng trống
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [userFullName, setUserFullName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { cartItems, setCartItems, setCartCount } = useCart();
    const [likedProducts, setLikedProducts] = useState([]);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const productDetail = await getProductDetail(slug);
                const related = await getRelatedProducts(productDetail.category);
                const reviewData = await getReview(slug);

                setProduct(productDetail);
                setReviews(reviewData.reviews);  // Cập nhật reviews với mảng reviews
                setRelatedProducts(related);
            } catch (err) {
                console.error(err);
                setError('Lỗi khi tải thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        };
    
        fetchProductDetail();
    }, [slug]);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await checkAuth();
                if (response && response.message === "Authenticated successfully") {
                    setIsLoggedIn(true);
                    setUserFullName(response.fullname); // Lưu tên người dùng
                } else {
                    setIsLoggedIn(false);
                }
            } catch (err) {
                console.error("Lỗi khi kiểm tra đăng nhập:", err);
                setIsLoggedIn(false);
            }
        };

        checkAuthentication();
    }, []);

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / reviews.length;
    };

    const calculateRatingPercentages = () => {
        const totalReviews = reviews.length;
        const percentages = [0, 0, 0, 0, 0];

        reviews.forEach((review) => {
            percentages[review.rating - 1] += 1; // Đếm số lượng mỗi mức sao
        });

        return percentages.map((count) => ((count / totalReviews) * 100).toFixed(1)); // Phần trăm
    };

    const handleReviewSubmit = async () => {
        if (!isLoggedIn) {
            toast.error("Vui lòng đăng nhập để đánh giá sản phẩm.");
            return;
        }
    
        if (!review || rating === 0) {
            toast.error("Vui lòng nhập đánh giá và chọn số sao.");
            return;
        }
    
        try {
            const newReview = {
                comment: review,
                rating,
                userFullName // Đảm bảo gửi tên người dùng
            };
            
            // Gửi đánh giá mới lên backend
            await submitReview(slug, newReview);
            
            // Cập nhật lại reviews trong state
            setReviews((prevReviews) => [
                ...prevReviews,
                { name: userFullName, ...newReview }
            ]);
            
            // Reset form đánh giá
            setReview('');
            setRating(0);
            toast.success('Bạn đánh giá thành công!');
        } catch (err) {
            console.error("Lỗi khi gửi đánh giá:", err);
            toast.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
        }
    };
    
    const averageRating = calculateAverageRating();
    const ratingPercentages = calculateRatingPercentages();

    const handleAddToCart = async () => {
        try {
            if (!isLoggedIn) {
                toast.error("Vui lòng đăng nhập để thêm sản phẩm.");
                return;
            }
    
            // Gửi đúng cấu trúc dữ liệu: { itemID, quantity }
            const newCart = {
                itemID: product.id,   // product.id là ID của sản phẩm
                quantity: quantity    // Số lượng sản phẩm
            };   
            
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingItemIndex = cartItems.findIndex(item => item.itemID === product.id);
            let updatedCartItems;

            if (existingItemIndex >= 0) {
                // Nếu sản phẩm đã có, cập nhật số lượng
                updatedCartItems = [...cartItems];
                updatedCartItems[existingItemIndex].quantity += quantity;
            } else {
                // Nếu chưa có, thêm sản phẩm vào giỏ hàng
                updatedCartItems = [...cartItems, newCart];
            }

            // Cập nhật giỏ hàng trong context và localStorage
            setCartItems(updatedCartItems);
            // Cập nhật số lượng giỏ hàng
            const newCartCount = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(newCartCount);
            // Gọi API để thêm sản phẩm vào giỏ hàng
            const response = await addToCart(newCart.itemID, newCart.quantity);
            
            // Kiểm tra phản hồi từ API
            if (response ) {
                toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
            } else {
                toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
            }
    
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
            toast.error("Thêm sản phẩm vào giỏ hàng thất bại.");
        }
    };
    
    useEffect(() => {
        // Khi component load, lấy danh sách yêu thích từ localStorage
        const storedLikedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
        setLikedProducts(storedLikedProducts);
    }, []);

    const handleAddToWishlist = async () => {
        try {
            const user = await checkAuth();
            if (!user) {
                toast.error("Vui lòng đăng nhập để thêm sản phẩm vào yêu thích.");
                return;
            }
    
            // Kiểm tra nếu sản phẩm chưa có trong danh sách yêu thích
            const isAlreadyLiked = likedProducts.some((likedProduct) => likedProduct.id === product.id);
    
            if (isAlreadyLiked) {
                toast.info("Sản phẩm đã có trong danh sách yêu thích.");
                return;
            }
    
            // Nếu sản phẩm chưa có trong danh sách yêu thích, thêm nó vào
            const updatedLikedProducts = [...likedProducts, product];
    
            // Gọi API để thêm sản phẩm vào danh sách yêu thích
            await addToLikelist(product.id);  // Giả sử addToLikelist là một API call
    
            // Cập nhật lại state và lưu vào localStorage
            setLikedProducts(updatedLikedProducts);
            localStorage.setItem(`likedProducts_${user.id}`, JSON.stringify(updatedLikedProducts));
    
            toast.success("Sản phẩm đã được thêm vào danh sách yêu thích.");
        } catch (error) {
            console.error("Lỗi khi xử lý yêu thích:", error);
            toast.error("Có lỗi xảy ra khi xử lý yêu thích.");
        }
    };
    
    // Kiểm tra nếu sản phẩm đã có trong danh sách yêu thích
    const isProductLiked = likedProducts.some(likedProduct => likedProduct.id === product.id);

    useEffect(() => {
        // Kiểm tra nếu Facebook SDK đã được tải
        if (window.FB) {
            window.FB.init({
                appId: '936746908356108', // Thay bằng App ID của bạn
                cookie: true,
                xfbml: true,
                version: 'v13.0', // Phiên bản của SDK
            });
        } else {
            console.error("Facebook SDK chưa được tải thành công.");
        }
      }, []);

    const handleShareOnFacebook = () => {
        if (!product || !product.itemName || !product.imageUrl) {
            console.error("Thông tin sản phẩm không đầy đủ để chia sẻ.");
            toast.error("Thông tin sản phẩm không đầy đủ để chia sẻ.");
            return;
        }
    
        const shareData = {
            method: 'share',
            href: window.location.href, // URL của trang sản phẩm
            quote: product.itemName,    // Tiêu đề sản phẩm
            picture: product.imageUrl   // Hình ảnh sản phẩm
        };
        console.log("Chia sẻ dữ liệu:", shareData);
    
        window.FB.ui(shareData, function(response) {
            if (response && !response.error_message) {
                console.log("Sản phẩm đã được chia sẻ!");
                toast.success("Sản phẩm đã được chia sẻ lên Facebook!");
            } else {
                console.error("Có lỗi khi chia sẻ:", response.error_message);
                toast.error("Có lỗi khi chia sẻ sản phẩm.");
            }
        });
      };

    if (loading) {
        return <div>Đang tải sản phẩm...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>Sản phẩm không tồn tại</div>;
    }

    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: product?.itemName || 'Chi tiết sản phẩm', link: '' },
    ];

    return (
        <div className="product-content">
            <Breadcrumb items={breadcrumbItems} />
            <div className="product-detail">
                <div className="detail-info">
                    <div className="product-content">
                        <img src={product.imageUrl} alt={product.itemName} className="product-image" />
                        <div className="product-info">
                            <h1>{product.itemName}</h1>
                            <p className="price">Giá: {Number(product.price).toLocaleString('vi-VN')}đ</p>
                            <div className="quantity-selector">
                                <span>Số lượng:</span>
                                <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <div className="button-grid-1">
                                <button className="add-to-cart-btn" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                                <button className="payment-btn">Mua nhanh</button>
                            </div>
                            <button className="share-btn" onClick={handleShareOnFacebook}><i class="fab fa-facebook-square"/>Chia sẻ</button>
                            <button
                                className={`likelist-btn ${isProductLiked ? 'liked' : ''}`}
                                onClick={handleAddToWishlist}
                            >
                                <i className={`fas fa-heart ${isProductLiked ? 'filled' : ''}`} />
                                {isProductLiked ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                            </button>
                        </div>
                    </div>
                    <div className="product-description">
                        <h3>Mô tả món ăn</h3>
                        <p dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>

                    <div className="reviews-section">
                        <h3>Đánh giá</h3>
                        <div className="rating-summary">
                            <div className="rating-total">
                                <StarRating rating={averageRating} readOnly />
                                <span className="total-ratings"> {reviews.length} đánh giá</span>
                            </div>
                            <div className="rating-breakdown">
                                {ratingPercentages.map((percentage, index) => (
                                    <div key={index} className="rating-row">
                                        <span>{1 + index } ★:</span>
                                        <div className="rating-bar">
                                            <div
                                                className="filled-bar"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span>{percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {isLoggedIn ? (
                            <div className="review-input">
                                <StarRating rating={rating} setRating={setRating} />
                                <input
                                    type="text"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Viết đánh giá của bạn"
                                />
                                <button onClick={handleReviewSubmit}>Đánh giá</button>
                            </div>
                        ) : (
                            <p>Vui lòng <a href="/login">đăng nhập</a> để đánh giá sản phẩm.</p>
                        )}
                        {reviews.length > 0 ? (
                            reviews.map((rev, index) => (
                                <div key={index} className="review-item">
                                    <strong>{rev["User.fullname"] || rev.name}</strong>
                                    <StarRating rating={rev.rating} readOnly />
                                    <p>{rev.comment}</p>
                                    <span className="review-time">
                                    {new Date(rev.createdAt).toLocaleDateString("vi-VN")}{" "}
                                    {new Date(rev.createdAt).toLocaleTimeString("vi-VN")} {/* Hoặc thay đổi định dạng theo ý muốn */}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                        )}
                    </div>
                </div>

                <div className="related-products">
                    <h3>Có thể bạn đang tìm</h3>
                    <div className="related-products-list">
                        {relatedProducts.length > 0 ? (
                            relatedProducts.map((related) => (
                                <div key={related.id} className="related-product">
                                    <img src={related.imageUrl} alt={related.itemName} />
                                    <div className="related-info">
                                        <h2>{related.itemName}</h2>
                                        <p>Giá: {Number(related.price).toLocaleString('vi-VN')}đ</p>
                                        <button>Đặt món</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có sản phẩm liên quan.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
