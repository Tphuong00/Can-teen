import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { removeFromLikelist, getLikelist } from '../../services/likelistService';
import Breadcrumb from '../Header/Breadcrumb';
import { Link, useNavigate } from "react-router-dom";
import './LikeList.scss';
import { checkAuth } from '../../services/checkAuth';
import slugify from 'slugify';

const Likelist = () => {
  const navigate = useNavigate();
  const [Likelist, setLikelist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    const response = checkAuth(); 
    if (!response ) {
      navigate('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }

    const fetchLikelist = async () => {
      try {
        const response = await getLikelist();
        setLikelist(response);
        setLikedItems(response.map(item => item.id));
      } catch (err) {
        console.error(err);
        setError('Lỗi khi tải danh sách yêu thích');
      } finally {
        setLoading(false);
      }
    };

    fetchLikelist();
  }, [navigate]); 

  const handleRemoveFromLikelist = async (product) => {
    try {
      const response = await removeFromLikelist(product);
      if (response) {
        toast.success('Sản phẩm đã được xóa khỏi danh sách yêu thích!');
        setLikelist((prev) => prev.filter((item) => item.id !== product));
        setLikedItems((prev) => prev.filter(id => id !== product));

        const user = checkAuth();
        if (user) {
          const updatedLikedItems = likedItems.filter((id) => id !== product.id);
          localStorage.setItem(`likedProducts_${user.id}`, JSON.stringify(updatedLikedItems));
        }
      }
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi xóa sản phẩm.');
    }
  };

  if (loading) return <div>Đang tải danh sách yêu thích...</div>;
  if (error) return <div>{error}</div>;

  const breadcrumbItems = [
    { label: 'Trang chủ', link: '/' },
    { label: 'Danh sách yêu thích', link: '/likelist' },
  ];

  return (
    <div className='likelist-contain'>
      <Breadcrumb items={breadcrumbItems} />
      <div className='likelist-content'>
        <h2>Danh sách yêu thích</h2>
        <div className="product-grid">
          {Likelist.length > 0 ? (
            Likelist.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.itemName} />
                  <div className="product-overlay">
                    <span className="icon"><i className="fa fa-shopping-cart"></i></span>
                  </div>
                  <div 
                    className="favorite-icon liked"
                    title="Xóa khỏi yêu thích"
                    onClick={() => handleRemoveFromLikelist(product.id)}
                  >
                    <i className= "fas fa-heart"></i>
                  </div>
                </div>
                <h3>{product.itemName}</h3>
                <p className="price-section">
                  {product.discount ? (
                    <>
                      <span className="price discounted">
                        {Number(product.originalPrice).toLocaleString('vi-VN')}đ
                      </span>
                      <span className="price">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                    </>
                  ) : (
                    <span className="price">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                  )}
                </p>
                <Link
                  to={`/${slugify(product.itemName, { lower: true, strict: true, remove: /[^\w\s-]/g }).replace('djai', 'dai')}`}
                  className="buy-now-button"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào trong danh sách yêu thích</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Likelist;
