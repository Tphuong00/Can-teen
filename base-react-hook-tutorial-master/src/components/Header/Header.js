import React from 'react';
import { Navbar, Nav, NavDropdown, Button, Form, FormControl } from "react-bootstrap";
import './Header.scss';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {checkAuth, logout } from '../../services/checkAuth';
import { getCart } from '../../services/cartService';
import MenuDropdown from './MenuDropdown';

const  Header = () => {
    let navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount, setCartCount] = useState(0);
    
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
        console.log('isLoggedIn:', isLoggedIn); 
    }, [isLoggedIn]); 
    
    useEffect(() => {
        const fetchCartCount = async () => {
            const response = await getCart();
            const totalQuantity = response.reduce((acc, item) => acc + item.quantity, 0); // Tính tổng quantity
            setCartCount(totalQuantity);
        };
        fetchCartCount();
    }, []);

    const goToLogin = () => {
        navigate('/login'); 
    };

    const goToRegister = () => {
        navigate('/register'); 
    };

    const handleLogout = async () => {
        await logout(); // Gọi API logout để xóa cookie ở backend
        setIsLoggedIn(false); // Cập nhật trạng thái đăng xuất
        navigate('/home');      
    };

    const handleLikeList = () => {
        navigate('/likelist'); 
    };

    const handleSearch = (e) => {
        e.preventDefault(); // Ngăn form submit mặc định
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery.trim()}`); // Điều hướng đến trang kết quả tìm kiếm
        }
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
                    <Form inline onSubmit={handleSearch}className="d-flex header-search">
                        <FormControl 
                            type="text" placeholder="Nhập tên món ăn..." 
                            className="mr-sm-2 form-search"  
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)}/>
                        <i variant="link" onClick={handleSearch} className="fas fa-search search"></i>
                    </Form>
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
                            {cartCount > 0 && (
                                <div className="cart-count">
                                    {cartCount}
                                </div>
                            )}
                        </div>
                        <Button variant="danger" className="ml-3 btt-resver" href='/reservation'>ĐẶT BÀN</Button>
                    </div>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default Header;
