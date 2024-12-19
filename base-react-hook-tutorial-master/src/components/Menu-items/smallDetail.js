import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import './smallDetail.scss';
import { addToCart } from '../../services/cartService';
import { useCart } from '../Cart/CartContext';

const SmallDetail = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const { cartItems, setCartItems, setCartCount } = useCart();
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
