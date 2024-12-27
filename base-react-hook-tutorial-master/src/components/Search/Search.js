import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { getSearch } from "../../services/productService";
import { checkAuth } from "../../services/checkAuth";
import { addToLikelist, removeFromLikelist } from "../../services/likelistService";
import { useCart } from "../Cart/CartContext";
import { Modal } from "react-bootstrap";
import Breadcrumb from "../Header/Breadcrumb";
import SmallDetail from "../Menu-items/smallDetail";
import { toast } from "react-toastify";
import slugify from "slugify";
import "./Search.scss";

const SearchPage = () => {
  const location = useLocation();
  const { cartItems, setCartItems, setCartCount } = useCart();

  // State Variables
  const [searchQuery] = useState(new URLSearchParams(location.search).get("query") || "");
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch Products based on Search Query
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await getSearch(searchQuery);
        console.log(response);
        setProducts(response);
      } catch (error) {
        setError("Đã có lỗi xảy ra trong quá trình tìm kiếm");
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim()) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  // Manage Liked Products
  useEffect(() => {
    const user = checkAuth();
    if (user) {
      const storedLikedProducts = JSON.parse(localStorage.getItem(`likedProducts_${user.id}`)) || [];
      setLikedProducts(storedLikedProducts);
    }
  }, []);

  useEffect(() => {
    const user = checkAuth();
    if (user) {
      localStorage.setItem(`likedProducts_${user.id}`, JSON.stringify(likedProducts));
    }
  }, [likedProducts]);

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Handle Add to Cart
  const handleAddToCart = async (product) => {
    try {
      const newCart = { itemID: product.id, quantity: 1 };
      const existingItemIndex = cartItems.findIndex(item => item.itemID === product.id);
      let updatedCartItems;

      if (existingItemIndex >= 0) {
        updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
      } else {
        updatedCartItems = [...cartItems, newCart];
      }

      setCartItems(updatedCartItems);
      const newCartCount = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(newCartCount);

      toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
      toast.error("Thêm sản phẩm vào giỏ hàng thất bại.");
    }
  };

  // Handle Add to Likelist
  const handleAddToLikelist = async (product) => {
    try {
      const user = checkAuth();
      if (!user) {
        toast.error("Bạn cần đăng nhập để yêu thích sản phẩm!");
        return;
      }

      const isLiked = likedProducts.includes(product.id);
      let updatedLikedProducts = [...likedProducts];
      if (isLiked) {
        await removeFromLikelist(product.id);
        updatedLikedProducts = updatedLikedProducts.filter(id => id !== product.id);
        toast.success("Đã xóa khỏi danh sách yêu thích!");
      } else {
        await addToLikelist(product.id);
        updatedLikedProducts.push(product.id);
        toast.success("Đã thêm vào danh sách yêu thích!");
      }
      setLikedProducts(updatedLikedProducts);
    } catch (error) {
      console.error('Lỗi khi xử lý yêu thích:', error);
    }
  };

  // Handle Modal Show
  const handleShow = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Tìm kiếm", link: "/search" },
  ];

  return (
    <div className="search-page-container">
      <Breadcrumb items={breadcrumbItems} />
      <div className="search-page-content">
      <h2>Kết quả tìm kiếm cho: {searchQuery}</h2>
        {loading && <p>Đang tìm kiếm...</p>}
        {error && <p>{error}</p>}

        <div className="product-list">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.itemName} />
                  <div className="product-overlay">
                    <span className="icon" onClick={() => handleShow(product)}>
                      <i className="fa fa-eye"></i>
                    </span>
                    <span className="icon" onClick={() => handleAddToCart(product)}>
                      <i className="fa fa-shopping-cart"></i>
                    </span>
                  </div>
                  <div
                    className={`favorite-icon ${likedProducts.includes(product.id) ? "liked" : ""}`}
                    onClick={() => handleAddToLikelist(product)}
                  >
                    <i className={`fas fa-heart ${likedProducts.includes(product.id) ? "liked" : ""}`}></i>
                  </div>
                </div>
                <h3>{product.itemName}</h3>
                <p className="price-section">
                  {product.discount ? (
                    <>
                      <span className="price discounted">
                        {Number(product.originalPrice).toLocaleString("vi-VN")}đ
                      </span>
                      <span className="price">
                        {Number(product.price).toLocaleString("vi-VN")}đ
                      </span>
                    </>
                  ) : (
                    <span className="price">
                      {Number(product.price).toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </p>
                <Link
                  to={`/${slugify(product.itemName, { lower: true, strict: true })}`}
                  className="buy-now-button"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào</p>
          )}
        </div>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton />
          <Modal.Body>
            <SmallDetail product={selectedProduct} />
          </Modal.Body>
        </Modal>

        <div className="pagination-page">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
