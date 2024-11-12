import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetail } from '../../services/productService';
import Breadcrumb from '../Header/Breadcrumb';

const ProductDetail = () => {
    const { slug } = useParams(); // Lấy itemName từ URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await getProductDetail(slug); // Gọi với itemName
                setProduct(response); // Cập nhật state product
            } catch (error) {
                console.error('Error fetching product detail:', error);
                setError('Lỗi khi tải chi tiết sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        console.log("Navigated to ProductDetail with itemName:", slug);
        fetchProductDetail();
    }, [slug]);

    if (loading) {
        return <div>Đang tải sản phẩm...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>Sản phẩm không tồn tại</div>;
    }

    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: product?.itemName || 'Chi tiết sản phẩm', link: '' },
    ];

    return (
        <div className="product-detail">
            <Breadcrumb items={breadcrumbItems} />
            <h1>{product.itemName}</h1>
            <img src={product.imageUrl} alt={product.itemName} />
            <p>{product.description}</p>
            <p>Giá: {product.price} VND</p>
            <p>Danh mục: {product.category}</p>
            <p>{product.availability ? 'Có sẵn' : 'Hết hàng'}</p>
        </div>
    );
};

export default ProductDetail;
