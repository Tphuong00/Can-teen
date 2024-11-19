import { useParams } from 'react-router-dom';
import Menu from '../components/Menu-items/Menu';
import ProductDetail from '../components/Menu-items/productDetail';

const DynamicPage = () => {
    const { slug } = useParams();
    
    // Danh sách các category
    const categories = ['trai-cay', 'mon-ngon-noi-bat', 'mon-nuoc', 'mon-kho', 'banh', 'ca-phe', 'tra-sua', 'nuoc-ngot','ga-ran', 'salad','com-theo-ngay', 'menu', 'sup'];
    
    if (categories.includes(slug)) {
        // Render trang category
        return <Menu category={slug} />;
    }else if (slug) {
        // Render trang chi tiết sản phẩm
        return <ProductDetail itemName={slug} />;
    } else {
        // Nếu không phải category hoặc itemName hợp lệ, trả về lỗi 404
        return <div>Không tìm thấy trang này.</div>;
    }
};

export default DynamicPage;