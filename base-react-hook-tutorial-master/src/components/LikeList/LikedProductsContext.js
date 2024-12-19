import React, { createContext, useState, useEffect } from 'react';

export const LikedProductsContext = createContext();

export const LikedProductsProvider = ({ children }) => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Lấy userId từ context auth hoặc localStorage
    const user = JSON.parse(localStorage.getItem('user')); // hoặc hàm checkAuth của bạn
    if (user) {
      setUserId(user.id);
      const storedLikedProducts = JSON.parse(localStorage.getItem(`likedProducts_${user.id}`)) || [];
      setLikedProducts(storedLikedProducts);
    }
  }, []);

  const addToLikelist = (productId) => {
    setLikedProducts((prev) => {
      const updated = [...prev, productId];
      localStorage.setItem(`likedProducts_${userId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromLikelist = (productId) => {
    setLikedProducts((prev) => {
      const updated = prev.filter(id => id !== productId);
      localStorage.setItem(`likedProducts_${userId}`, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <LikedProductsContext.Provider value={{ likedProducts, addToLikelist, removeFromLikelist }}>
      {children}
    </LikedProductsContext.Provider>
  );
};
