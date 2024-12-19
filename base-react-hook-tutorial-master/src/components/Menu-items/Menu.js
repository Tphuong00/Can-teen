import React, { useState, useEffect } from "react";
import { Link, useNavigate} from "react-router-dom";
import './menu.scss';
import Breadcrumb from '../Header/Breadcrumb';
import { getProducts } from '../../services/productService';
import slugify from 'slugify';
import { Modal } from "react-bootstrap"; 
import SmallDetail from './smallDetail';
import { addToLikelist, removeFromLikelist} from '../../services/likelistService';
import { toast } from "react-toastify";
import { checkAuth } from "../../services/checkAuth";
import { addToCart } from '../../services/cartService';
import { useCart } from '../Cart/CartContext';

const Menu = ({ category}) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [sortOption, setSortOption] = useState("default");
    const [filters, setFilters] = useState({
        category:  category || '',
        price: [],
        mealTime: [],
    });
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [displayCategory, setDisplayCategory] = useState("");
    const [likedProducts, setLikedProducts] = useState([]);
    const { cartItems, setCartItems, setCartCount } = useCart();
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const queryOptions = { ...filters, sort: sortOption };
            
                if (filters.category === 'mon-ngon-noi-bat') {
                    queryOptions.isPopular = true;
                } else {
                    delete queryOptions.isPopular;
                }

                const response = await getProducts(queryOptions);
                setProducts(response);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [filters, category, sortOption, displayCategory]);

    useEffect(() => {
        if (category) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                category: category === "menu" ? "" : category
            }));
        }
        setDisplayCategory(category);
    }, [category]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleCategoryChange = (category) => {
        setFilters((prevFilters) => ({ 
            ...prevFilters,
            category: category === "menu" ? "" : category 
        }));
        setDisplayCategory(category);
        navigate(`/${category}`);
    };

    const handleCheckboxChange = (e, filterType) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        setFilters((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                [filterType]: isChecked
                    ? [...prevFilters[filterType], value]
                    : prevFilters[filterType].filter((item) => item !== value),
            };
            return updatedFilters;
        });
    };

    const toggleCategory = (category) => {
        setExpandedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category]
        );
    };

    const categoryNames = {
        "trai-cay": "Trái cây",
        "mon-ngon-noi-bat": "Món ngon nổi bật",
        "mon-nuoc": "Món nước",
        "mon-kho":"Món khô",
        "banh":"Bánh",
        "ca-phe":"Cà phê",
        "tra-sua":"Trà sữa",
        "nuoc-ngot":"Nước ngọt",
        "ga-ran":"Gà rán",
        "salad":"Salad",
        "sup":"Súp",
        "com-theo-ngay":"Cơm theo ngày",
    };  
    
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleShow = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    useEffect(() => {
        const user = checkAuth();
        if (user) {
            // Lấy danh sách yêu thích từ localStorage
            const storedLikedProducts = JSON.parse(localStorage.getItem(`likedProducts_${user.id}`)) || [];
            if (Array.isArray(storedLikedProducts)) {
                setLikedProducts(storedLikedProducts);  // Cập nhật trạng thái likedProducts từ localStorage
            } else {
                localStorage.setItem(`likedProducts_${user.id}`, JSON.stringify([]));
                setLikedProducts([]);  // Khởi tạo lại danh sách nếu dữ liệu không hợp lệ
            }
        }
    }, []);  // Chạy một lần khi component mount
    
    useEffect(() => {
        // Đảm bảo rằng khi danh sách yêu thích thay đổi, ta cập nhật lại localStorage
        const user = checkAuth();
        if (user) {
            localStorage.setItem(`likedProducts_${user.id}`, JSON.stringify(likedProducts));
        }
    }, [likedProducts]);  // Chạy mỗi khi likedProducts thay đổi
    

    const handleAddToLikelist = async (product) => {
        try {
            const user = checkAuth();
            if (!user) {
                toast.error("Bạn cần đăng nhập để yêu thích sản phẩm!");
            }
            // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
            const isLiked = likedProducts.includes(product.id);
            let updatedLikedProducts = [...likedProducts];
            if (isLiked) {
                await removeFromLikelist(product.id);
                updatedLikedProducts = updatedLikedProducts.filter((id) => id !== product.id);
                // setLikedProducts(updatedLikedProducts);
                // localStorage.setItem(`likedProducts_${user.id}`, JSON.stringify(updatedLikedProducts));  // Cập nhật lại localStorage
                toast.success("Đã xóa khỏi danh sách yêu thích!");
            } else {
                await addToLikelist(product.id);
                updatedLikedProducts.push(product.id);
                // setLikedProducts(updatedLikedProducts);
                // localStorage.setItem(`likedProducts_${user.id}`, JSON.stringify(updatedLikedProducts));  // Lưu vào localStorage với userId
                toast.success("Đã thêm vào danh sách yêu thích!");
            }
            setLikedProducts(updatedLikedProducts);
                localStorage.setItem(`likedProducts_${user.id}`, JSON.stringify(updatedLikedProducts)); 
        } catch (error) {
            console.error('Lỗi khi xử lý yêu thích:', error);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const newCart = {
                itemID: product.id,   // product.id là ID của sản phẩm
                quantity: 1    // Số lượng sản phẩm
            };

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingItemIndex = cartItems.findIndex(item => item.itemID === product.id);
            let updatedCartItems;

            if (existingItemIndex >= 0) {
                // Nếu sản phẩm đã có, cập nhật số lượng
                updatedCartItems = [...cartItems];
                updatedCartItems[existingItemIndex].quantity +=1;
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: categoryNames[displayCategory] || 'Tất cả món ăn', link: `/${displayCategory}` },
    ];

    return (
        <div className="product-list-container">
            <Breadcrumb items={breadcrumbItems} />
            <div className="product-list-content">
                <div className="filter-sidebar col-12">
                    <div className="filter-section filter-category">
                        <h3>MENU</h3>
                        <div onClick={() => handleCategoryChange("menu")}>
                            <label><Link to="/menu">Tất cả món ăn</Link></label>
                        </div>

                        <div className="category">
                            <div onClick={() => toggleCategory("mon-chinh")}>
                                <label className="category-label">
                                    <div>Món chính</div> 
                                    <span>{expandedCategories.includes("mon-chinh") ? "-" : "+"}</span>
                                </label>  
                            </div>
                            {expandedCategories.includes("mon-chinh") && (
                                <div className="sub-categories">
                                    <div onClick={() => handleCategoryChange("mon-nuoc")}>
                                        <label><Link to="mon-nuoc">Món nước</Link></label>
                                    </div>
                                    <div onClick={() => handleCategoryChange("mon-kho")}>
                                        <label><Link to="mon-kho">Món khô</Link></label>
                                    </div>
                                    <div onClick={() => handleCategoryChange("com-theo-ngay")}>
                                        <label><Link to="com-theo-ngay">Cơm theo ngày</Link></label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="category">
                            <div onClick={() => toggleCategory("mon-khai-vi")}>
                                <label className="category-label">
                                    <div>Món khai vị</div> 
                                    <span>{expandedCategories.includes("mon-khai-vi") ? "-" : "+"}</span>
                                </label>  
                            </div>
                            {expandedCategories.includes("mon-khai-vi") && (
                                <div className="sub-categories">
                                    <div onClick={() => handleCategoryChange("ga-ran")}>
                                        <label><Link to="ga-ran">Gà rán</Link></label>
                                    </div>
                                    <div onClick={() => handleCategoryChange("salad")}>
                                        <label><Link to="salad">Salad</Link></label>
                                    </div>
                                    <div onClick={() => handleCategoryChange("sup")}>
                                        <label><Link to="sup">Súp</Link></label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="category">
                            <div onClick={() => toggleCategory("banh-trai-cay")}>
                                <label className="category-label">
                                    <div>Bánh - Trái cây</div> 
                                    <span>{expandedCategories.includes("banh-trai-cay") ? "-" : "+"}</span>
                                </label>  
                            </div>
                            {expandedCategories.includes("banh-trai-cay") && (
                                <div className="sub-categories">
                                    <div onClick={() => handleCategoryChange("trai-cay")}>
                                        <label><Link to="trai-cay">Trái cây</Link></label>
                                    </div>
                                    <div onClick={() => handleCategoryChange("banh")}>
                                        <label><Link to="banh">Bánh</Link></label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="category">
                            <div onClick={() => toggleCategory("do-uong")}>
                                <label className="category-label">
                                    <div>Đồ uống</div> 
                                    <span>{expandedCategories.includes("do-uong") ? "-" : "+"}</span>
                                </label>  
                            </div>
                            {expandedCategories.includes("do-uong") && (
                                <div className="sub-categories">
                                    <div onClick={() => handleCategoryChange("ca-phe")}>
                                        <label><Link to="ca-phe">Cà phê</Link></label>
                                    </div>
                                    <div onClick={() => handleCategoryChange("tra-sua")}>
                                        <label><Link to="tra-sua">Trà sữa</Link></label>
                                    </div>
                                    <div onClick={() => handleCategoryChange("nuoc-ngot")}>
                                        <label><Link to="nuoc-ngot">Nước ngọt</Link></label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div onClick={() => handleCategoryChange("mon-ngon-noi-bat")}>
                            <label><Link to="/mon-ngon-noi-bat">Món ngon nổi bật</Link></label>
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="filter-section filter-price">
                        <h3>MỨC GIÁ</h3>
                        {['0-20000', '21000-30000', '31000-50000', '>50000'].map((value) => (
                            <label key={value}>
                                <input
                                    type="checkbox"
                                    value={value}
                                    onChange={(e) => handleCheckboxChange(e, 'price')}
                                />
                                {value === '0-20000' && 'Dưới 20.000đ'}
                                {value === '21000-30000' && '20.000đ - 30.000đ'}
                                {value === '31000-50000' && '30.000đ - 50.000đ'}
                                {value === '>50000' && 'Trên 50.000đ'}
                            </label>
                        ))}
                    </div>

                    {/* Meal Time Filter */}
                    <div className="filter-section filter-meal">
                        <h3>THEO BỮA ĂN</h3>
                        <label>
                            <input type="checkbox" value="1" onChange={(e) => handleCheckboxChange(e, 'mealTime')}/>
                            Bữa sáng
                        </label>
                        <label>
                            <input type="checkbox" value="2" onChange={(e) => handleCheckboxChange(e, 'mealTime')}/>
                            Bữa trưa
                        </label>
                    </div>
                </div>

                <div className="product-list">
                    <div className="product-header">
                        <label className="product-header-title">{categoryNames[filters.category] || "Tất cả món ăn"}</label>
                        <div className="filter-section filter-sort">
                            <label>Sắp xếp:</label>
                            <select value={sortOption} onChange={handleSortChange}>
                                <option value="default">Mặc định</option>
                                <option value="price_asc">Giá tăng dần</option>
                                <option value="price_desc">Giá giảm dần</option>
                                <option value="name_asc">A đến Z</option>
                                <option value="name_desc">Z đến A</option>
                            </select>
                        </div>
                    </div>

                    <div className="product-grid">
                        {products.length > 0 ? (
                            currentProducts.map((product) => (
                                <div key={product.id} className="product-card">
                                <div className="product-image">
                                    <img src={product.imageUrl} alt={product.itemName} />
                                    <div className="product-overlay">
                                        <span className="icon" onClick={() => handleShow(product)}><i className="fa fa-eye"></i></span>
                                        <span className="icon" onClick={()=>handleAddToCart(product)}><i className="fa fa-shopping-cart"></i></span>
                                    </div>
                                    <div 
                                        className={`favorite-icon ${likedProducts.includes(product.id) ? 'liked' : ''}`} 
                                        title={likedProducts.includes(product.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                                        onClick={() => handleAddToLikelist(product)}
                                    >
                                        <i className={`fas fa-heart ${likedProducts.includes(product.id) ? 'liked' : ''}`}></i>
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
                            <p>Không có sản phẩm nào</p>
                        )}

                        <Modal show={showModal} onHide={handleClose}>
                            <Modal.Header closeButton />
                            <Modal.Body>
                                <SmallDetail product={selectedProduct} />
                            </Modal.Body>
                        </Modal>
                    </div> 
                    <div className="pagination-page">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            >
                            &laquo;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                        <button
                                key={i + 1}
                                className={currentPage === i + 1 ? "active" : ""}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                        </button>
                            ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            >
                            &raquo;
                        </button>
                    </div>                     
                </div>
            </div>         
        </div>
    );
};

export default Menu;
