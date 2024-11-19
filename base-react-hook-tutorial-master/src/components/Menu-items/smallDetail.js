import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './smallDetail.scss';

const SmallDetail = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    if (!product) {
        return <div>Thông tin sản phẩm không tồn tại</div>;
    }

    return (
        <div className="small-detail">
            <div className="small-detail-image">
                <img src={product.imageUrl} alt={product.itemName} />
            </div>
            <div className="small-detail-info">
                <h2 className="product-name">{product.itemName}</h2>
                <p className="price">Giá: {Number(product.price).toLocaleString('vi-VN')}đ</p>
                <div className="quantity-selector">
                    <span>Số lượng:</span>
                    <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                {product.originalPrice && (
                    <p className="original-price">
                        Giá gốc: <span>{Number(product.originalPrice).toLocaleString('vi-VN')}đ</span>
                    </p>
                )}
                <div className="button-grid">
                    <button className="add-to-cart-btn">Thêm vào giỏ hàng</button>
                    <button className="payment-btn">Mua nhanh</button>
                </div>
            </div>
        </div>
    );
};

SmallDetail.propTypes = {
    product: PropTypes.shape({
        imageUrl: PropTypes.string,
        itemName: PropTypes.string,
        price: PropTypes.number,
        originalPrice: PropTypes.number,
        description: PropTypes.string,
    }),
};

export default SmallDetail;
