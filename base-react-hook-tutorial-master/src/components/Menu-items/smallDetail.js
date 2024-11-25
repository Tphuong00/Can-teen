import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import './smallDetail.scss';
import { addToCart } from '../../services/cartService';

const SmallDetail = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    if (!product) {
        return <div>Thông tin sản phẩm không tồn tại</div>;
    }
    
    const handleAddToCart = async () => {
        try {
            const newCart = {
                itemID: product.id,   // product.id là ID của sản phẩm
                quantity: quantity    // Số lượng sản phẩm
            };

            const response = await addToCart(newCart.itemID, newCart.quantity);
            
            if (response) {
                toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
            } else {
                toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
            }
    
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
            toast.error("Thêm sản phẩm vào giỏ hàng thất bại.");
        }
    };

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
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
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
