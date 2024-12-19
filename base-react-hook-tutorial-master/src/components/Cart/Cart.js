import React, { useState, useEffect } from "react";
import { getCart, removeFromCart, updateCart } from "../../services/cartService";
import "./Cart.scss";
import Breadcrumb from "../Header/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../services/checkAuth"; 
import { toast } from "react-toastify";
import { useCart } from './CartContext';

const Cart = () => {
  // const [cartItems, setCartItems] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [cartIDToDelete, setCartIDToDelete] = useState(null); 
  const navigate = useNavigate(); 
  const { cartItems, setCartItems, setCartCount } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await checkAuth(); 
        if (!response) {
          navigate("/login"); 
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra xác thực:", error);
        navigate("/login"); 
      }
    };
    checkLoginStatus();
  }, [navigate]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart(); 
        setCartItems(response || []);
        const totalQuantity = response.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalQuantity);
        setLoading(false); 
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setError("Không thể tải giỏ hàng. Vui lòng thử lại sau.");
        setLoading(false); // Stop loading
      }
    };
    fetchCart(); 
  }, [setCartItems, setCartCount]); 

  const handleSelectItem = (item) => {
    if (selectedItems.some((selectedItem) => selectedItem.id === item.id)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  
  // Handle removing an item from the cart
  const handleRemoveItem = async (cartID) => {
    try {
        const response = await removeFromCart(cartID); 
        if (response) { 
            setCartItems(cartItems.filter((item) => item.id !== cartID));
            toast.success("Bạn đã xoá sản phẩm khỏi giỏ hàng thành công");
        } else {
            toast.error("Failed to remove item:", response.message);
        }
    } catch (error) {
        console.error("Error removing item from cart:", error);
        toast.error("Không thể xóa sản phẩm khỏi giỏ hàng.");
    }
};

const handleShowModal = (cartID) => {
  setCartIDToDelete(cartID);
  setShowModal(true);
};

// Ẩn modal nếu người dùng hủy
const handleCloseModal = () => {
  setShowModal(false);
  setCartIDToDelete(null); // Reset ID sản phẩm
};
const handleConfirmDelete = async () => {
  if (cartIDToDelete) {
    await handleRemoveItem(cartIDToDelete);
    setShowModal(false);
    setCartIDToDelete(null);
  }
};

  // Handle updating the quantity of an item
const handleUpdateQuantity = async (cartID, newQuantity) => {
    try {
      if (newQuantity === 0) {
        // Nếu số lượng là 0, xoá sản phẩm khỏi giỏ hàng
        handleShowModal(cartID);
        return;
      }
  
      const response = await updateCart(cartID, newQuantity);
  
      if (response) {
        const updatedItem = response; 
  
        setCartItems(cartItems.map((item) =>
          item.id === cartID
            ? {
                ...item,
                quantity: updatedItem.quantity,  // Cập nhật số lượng
                priceTotal: updatedItem.priceTotal,  // Cập nhật giá tổng
              }
            : item
        ));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  // Calculate the total price of all items in the cart
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.priceTotal, 0);
  };

  const handleOrder = () => {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    navigate("/order", { state: { selectedItems } });
  }

  // Loading state or error message if needed
  if (loading) return <div className="loading">Đang tải...</div>;

  if (error) return <div className="error">{error}</div>;

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Giỏ hàng", link: "/cart" },
  ];

  return (
    <div className="cart-container">
      <Breadcrumb items={breadcrumbItems} />
      <div className="cart-content">
        <div className="cart-title">GIỎ HÀNG CỦA BẠN</div>
        {/* {cartItems.length > 0 ? ( */}
          <table className="cart-table">
            <thead>
              <tr>
                <th> </th>
                <th>Thông tin sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Số tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                  <input 
                    type="checkbox" 
                    checked={selectedItems.some((selectedItem) => selectedItem.id === item.id)}
                    onChange={() => handleSelectItem(item)}
                  />
                </td>
                  <td className="product-info">
                    <img
                      src={item["Menu_Item.imageUrl"]}
                      alt={item["Menu_Item.itemName"]}
                      className="product-image"
                    />
                    <span className="product-name">{item["Menu_Item.itemName"]}</span>
                  </td>
                  <td >{Number(item["Menu_Item.price"] || 0).toLocaleString('vi-VN')}đ</td>
                  <td>
                    <div className="quantity-control">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>                   
                  </td>
                  <td >{Number(item.priceTotal).toLocaleString('vi-VN')}đ</td>
                  <td>
                    <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        {/* ) : (
          <p>Giỏ hàng của bạn hiện tại trống.</p>
        )} */}
        <div className="cart-footer">
          <span className="total-price">Tổng tiền: {calculateTotal().toLocaleString()}đ</span>
          <button className="checkout-btn" onClick={handleOrder}>Thanh toán</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng không?</h3>
            <div className="modal-actions">
              <button onClick={handleCloseModal}>Hủy</button>
              <button onClick={handleConfirmDelete}>Xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
