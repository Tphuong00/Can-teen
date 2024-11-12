import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './menu.scss';
import Breadcrumb from '../Header/Breadcrumb';
import { getProducts } from '../../services/productService';
import slugify from 'slugify';

const Menu = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [sortOption, setSortOption] = useState("default");
    const [filters, setFilters] = useState({
        category: '',
        price: [],
        mealTime: [],
    });
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [displayCategory, setDisplayCategory] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts({ ...filters, sort: sortOption });
                setProducts(response);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [filters, sortOption]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleCategoryChange = (category) => {
        setFilters({
            ...filters,
            category,
        });
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
                            products.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                <img src={product.imageUrl} alt={product.itemName} />
                                <div className="product-overlay">
                                    <span className="icon"><i className="fa fa-eye"></i></span>
                                    <span className="icon"><i className="fa fa-shopping-cart"></i></span>
                                </div>
                                <div className="favorite-icon" title="Thêm vào yêu thích">
                                    <i className="fa fa-heart"></i>
                                </div>
                                </div>
                                <h3>{product.itemName}</h3>
                                <p className="price-section">
                                {product.discount ? (
                                    <>
                                    <span className="price discounted">
                                        {product.originalPrice.toLocaleString()}đ
                                    </span>
                                    <span className="price">{product.price.toLocaleString()}đ</span>
                                    </>
                                ) : (
                                    <span className="price">{product.price.toLocaleString()}đ</span>
                                )}
                                </p>
                                <Link
                                    to={`/${displayCategory}/${slugify(product.itemName, { lower: true, strict: true, remove: /[^\w\s-]/g }).replace('djai', 'dai')}`}
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

                </div>
            </div>         
        </div>
    );
};

export default Menu;
