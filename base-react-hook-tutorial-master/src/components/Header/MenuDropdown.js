import React, { useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import './MenuDropdown.scss';

const MenuDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleCategorySelect = (category) => {
        navigate(`/${category}`); // Chuyển hướng đến URL tương ứng
        setIsOpen(false);
    };

    const categories = [
        {
            title: 'Món chính',
            items: [
                { name: 'Món nước', key: 'mon-nuoc' },
                { name: 'Món khô', key: 'mon-kho' },
                { name: 'Cơm theo ngày', key: 'com-theo-ngay' },
            ],
        },
        {
            title: 'Món khai vị',
            items: [
                { name: 'Gà rán', key: 'ga-ran' },
                { name: 'Salad', key: 'salad' },
                { name: 'Súp', key: 'sup' },
            ],
        },
        {
            title: 'Bánh, Trái cây',
            items: [
                { name: 'Bánh', key: 'banh' },
                { name: 'Trái cây', key: 'trai-cay' },
            ],
        },
        {
            title: 'Đồ uống',
            items: [
                { name: 'Cà phê', key: 'ca-phe' },
                { name: 'Trà sữa', key: 'tra-sua' },
                { name: 'Nước ngọt', key: 'nuoc-ngot' },
            ],
        },
    ];
    

    return (
        <NavDropdown title="Menu" id="basic-nav-dropdown" className="custom-dropdown"
            show={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
        >
            <div className="dropdown-content">
            {categories.map((category, index) => (
            <div className="dropdown-column" key={index}>
                <h6>{category.title}</h6>
                {category.items.map((item) => (
                    <NavDropdown.Item key={item.key} onClick={() => handleCategorySelect(item.key)}>
                        {item.name}
                    </NavDropdown.Item>
                ))}
            </div>
        ))}
            </div>
        </NavDropdown>
    );
};

export default MenuDropdown;
