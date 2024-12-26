import React from 'react';
import { Navbar, Nav, NavDropdown, Button, Form, FormControl } from "react-bootstrap";
import './Header.scss';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {checkAuth, logout } from '../../services/checkAuth';
import {getSearch } from '../../services/productService';
import MenuDropdown from './MenuDropdown';
import { useCart } from '../Cart/CartContext';

const  Header = () => {
    let navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const {cartCount,  resetCart} = useCart();
    
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await checkAuth(); 
                if (response && response.message === "Authenticated successfully") {
                    setIsLoggedIn(true);
                }
                else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Check Auth Error:', error); 
                setIsLoggedIn(false); 
            }
        };
    
        checkLoginStatus(); 
    }, []); 
    
    useEffect(() => {
        if (isLoggedIn) {
        console.log('isLoggedIn:', isLoggedIn); 
        console.log('cartCount:', cartCount);

        }
    }, [isLoggedIn, cartCount]); 

   
    const goToLogin = () => {
        navigate('/login'); 
    };

    const goToRegister = () => {
        navigate('/register'); 
    };

    const handleLogout = async () => {
        await logout(); // Gọi API logout để xóa cookie ở backend
        resetCart(); //Xoá tổng số hàng
        setIsLoggedIn(false); // Cập nhật trạng thái đăng xuất
        window.location.reload(navigate('/home'));      
    };

    const handleLikeList = () => {
        navigate('/likelist'); 
    };

    const handleSearch = async (e) => {
        setSearchQuery(e.target.value); // Cập nhật từ khóa tìm kiếm

        if (e.target.value.trim()) {
            try {
                // Gọi API tìm kiếm và cập nhật kết quả
                const response = await getSearch(e.target.value);
                setSearchResults(response); 
                setDropdownVisible(true);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]); // Nếu có lỗi, đặt kết quả tìm kiếm về rỗng
            }
        } else {
            setSearchResults([]); // Nếu không có từ khóa tìm kiếm, đặt kết quả về rỗng
        }
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    const handleProductClick = (itemName) => {
        setDropdownVisible(false); // Đóng dropdown khi nhấn vào một món ăn
        navigate(`/${itemName.toLowerCase().replace(/ /g, '-')}`); // Điều hướng đến trang chi tiết món ăn
    };

    const handleViewAllClick = () => {
        setDropdownVisible(false); // Đóng dropdown khi nhấn "Xem tất cả"
        navigate(`/search?query=${searchQuery}`); // Điều hướng đến trang tìm kiếm đầy đủ
    };

    const handleCart = () =>{
        navigate('/cart')
    }

  return (
    <Navbar expand="lg" className="header-container">
            <div className="container">
                <Navbar.Brand className="header-title" href="/home">CĂN TEEN</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className='header-toggle' />
                <Navbar.Collapse id="basic-navbar-nav" className='header-collaper'>
                    <Nav className="mr-auto header-nav">
                        <Nav.Link href="/home">Trang chủ</Nav.Link>
                        <Nav.Link href="/introduce">Giới thiệu</Nav.Link>
                        <MenuDropdown />
                        <Nav.Link href="/mon-ngon-noi-bat">Món ngon nổi bật</Nav.Link>
                        <Nav.Link href="/news">Tin tức</Nav.Link>
                        <Nav.Link href="/contact">Liên hệ</Nav.Link>
                    </Nav>
                    <div className="search-container">
                        <Form inline onSubmit={handleSearchSubmit} className="d-flex header-search">
                            <FormControl 
                                type="text" placeholder="Nhập tên món ăn..." 
                                className="mr-sm-2 form-search"  
                                value={searchQuery} 
                                // onChange={(e) => setSearchQuery(e.target.value)}
                                onChange={handleSearch}/>
                            <i variant="link" onClick={handleSearchSubmit} className="fas fa-search search"></i>
                        </Form>
                        {dropdownVisible && searchQuery.trim() && searchResults.length > 0 && (
                            <div className="search-dropdown">
                                <ul>
                                    {searchResults.slice(0, 5).map((item) => ( // Giới hạn 5 sản phẩm đầu tiên
                                        <li
                                            key={item.id}
                                            onClick={() => handleProductClick(item.itemName)} // Chuyển hướng đến trang chi tiết món ăn
                                        >
                                            <img
                                                src={item.imageUrl}
                                                alt={item.itemName} // Sửa lại alt để hiển thị tên món ăn và giá
                                                className="search-image"
                                            />
                                            <span>{item.itemName}<span className="item-price">{item.price} VNĐ</span></span>
                                        </li>
                                    ))}
                                </ul>
                                {searchResults.length > 3 && (
                                    <div className="view-all">
                                        <button onClick={handleViewAllClick}>
                                            Xem tất cả
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="d-flex align-items-center header-button">
                        <NavDropdown
                            title={<i className="fas fa-user user-icon"></i>}
                            id="user-dropdown"
                            className="user-dropdown"
                            align="end"
                        >
                            {isLoggedIn ? (
                                <>
                                    <NavDropdown.Item href="/profile" className='user-profile'>Tài khoản</NavDropdown.Item>
                                    <NavDropdown.Item className='user-profile' onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
                                    <NavDropdown.Item className='user-profile' onClick={handleLikeList}>Danh sách yêu thích</NavDropdown.Item>
                                </>
                            ) : (
                                <>
                                    <NavDropdown.Item className='user-profile' onClick={goToLogin}>Đăng nhập</NavDropdown.Item>
                                    <NavDropdown.Item className='user-profile' onClick={goToRegister}>Đăng ký</NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>
                        <div className="cart-icon" variant="link" onClick={handleCart}>
                            <i className="fas fa-shopping-cart cart"></i>
                                <div className="cart-count">
                                    {cartCount > 0 ? cartCount : 0}
                                </div>
                        </div>
                        <Button variant="danger" className="ml-3 btt-resver" href='/reservation'>ĐẶT BÀN</Button>
                    </div>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default Header;
