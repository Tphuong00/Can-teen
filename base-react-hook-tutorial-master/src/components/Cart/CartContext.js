// CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo context cho giỏ hàng
const CartContext = createContext();

// Hook để sử dụng CartContext
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider để quản lý trạng thái giỏ hàng
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Khi load ứng dụng, kiểm tra xem có dữ liệu giỏ hàng trong localStorage không
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  // Cập nhật tổng số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalQuantity); // Cập nhật cartCount mỗi khi cartItems thay đổi
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);    // Tổng số lượng sản phẩm trong giỏ hàng

  // Cập nhật tổng số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalQuantity); // Cập nhật cartCount mỗi khi cartItems thay đổi
  }, [cartItems]);

  const resetCart = () => {
    setCartItems([]);  // Reset cartItems to an empty array
    setCartCount(0);   // Reset cartCount to 0
    localStorage.removeItem('cartItems');  // Clear cart data from localStorage
  };
 
  // useEffect(() => {
  //   const savedCart = localStorage.getItem('cartItems');
  //   console.log('savedCart:', savedCart);
  //   if (savedCart) {
  //     const parsedCart = JSON.parse(savedCart);
  //     setCartItems(parsedCart); // Đồng bộ giỏ hàng từ localStorage
  //     const totalQuantity = parsedCart.reduce((acc, item) => acc + item.quantity, 0);
  //     setCartCount(totalQuantity); // Tính toán lại cartCount từ cartItems
  //   }
  // }, []);

  const syncCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);  // Đồng bộ giỏ hàng từ localStorage
      const totalQuantity = parsedCart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQuantity);  // Tính toán lại cartCount từ cartItems
    }
  };

  // Gọi syncCartFromLocalStorage khi người dùng đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      syncCartFromLocalStorage();
    }
  }, [isLoggedIn]);

  // Hàm đăng nhập thành công
  const login = () => {
    setIsLoggedIn(true);  // Đánh dấu là người dùng đã đăng nhập
  };


  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, setCartCount, resetCart,  login }}>
      {children}
    </CartContext.Provider>
  );
};
