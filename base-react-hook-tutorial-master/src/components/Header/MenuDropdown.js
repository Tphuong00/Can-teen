import React, { useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import './MenuDropdown.scss';

const MenuDropdown = () => {
    const [isOpen, setIsOpen] = useState(false); 
    const navigate = useNavigate(); // Khai báo useNavigate

    const handleSelectCategory = (category) => {
        // Chuyển hướng đến trang lọc theo category
        navigate(`/${category}`);
    };

    return (
        <NavDropdown title="Menu" id="basic-nav-dropdown" className="custom-dropdown"
            show={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
        >
            <div className="dropdown-content">
                <div className="dropdown-column">
                    <h6>Món chính</h6>
                    <NavDropdown.Item onClick={() => handleSelectCategory('mon-nuoc')}>Món nước</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleSelectCategory('mon-kho')}>Món khô</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleSelectCategory('com-theo-ngay')}>Cơm theo ngày</NavDropdown.Item>
                </div>
                <div className="dropdown-column">
                    <h6>Món khai vị</h6>
                    <NavDropdown.Item onClick={() => handleSelectCategory('ga-ran')}>Gà rán</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleSelectCategory('salad')}>Salad</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleSelectCategory('sup')}>Súp</NavDropdown.Item>
                </div>
                <div className="dropdown-column">
                    <h6>Bánh, Trái cây</h6>
                    <NavDropdown.Item onClick={() => handleSelectCategory('banh')}>Bánh</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleSelectCategory('trai-cay')}>Trái cây</NavDropdown.Item>
                </div>
                <div className="dropdown-column">
                    <h6>Đồ Uống</h6>
                    <NavDropdown.Item onClick={() => handleSelectCategory('ca-phe')}>Cà phê</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleSelectCategory('tra-sua')}>Trà sữa</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleSelectCategory('nuoc-ngot')}>Nước ngọt</NavDropdown.Item>
                </div>
            </div>
        </NavDropdown>
    );
};

export default MenuDropdown;
