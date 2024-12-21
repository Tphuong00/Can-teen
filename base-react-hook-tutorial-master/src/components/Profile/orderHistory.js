import React, { useEffect, useState } from 'react';
import { getOrder } from '../../services/orderService';
import './orderHistory.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    // Phương thức tính phí vận chuyển
    const getShippingFee = (shippingMethod) => {
        switch (shippingMethod) {
            case "Giao hàng tận nơi trong trường":
                return 5000;
            case "Giao hàng ngoài trường":
                return 20000;
            default:
                return 0;  // Free shipping for "Lấy hàng tại canteen"
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrder();
                console.log(response.data);  // Kiểm tra cấu trúc dữ liệu
                setOrders([response.data]);  // Đảm bảo orders là một mảng
            } catch (err) {
                toast.error(err.response ? err.response.data.message : 'Có lỗi xảy ra');
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="order-history">
            <div className="title-orderhistory">ĐƠN HÀNG CỦA BẠN</div>
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Thời gian</th>
                        <th>Thông tin giao hàng</th>
                        <th>Thông tin sản phẩm</th>
                        <th>Thanh toán</th>
                        <th>TT Vận chuyển</th>
                        <th>Ghi chú</th>
                        <th>Xử lí</th>
                    </tr>
                </thead>
                <tbody>
                    {orders && orders.length > 0 ? (
                        orders.map((order, index) => {
                            // Lấy thông tin sản phẩm từ Order_Items (là đối tượng, không phải mảng)
                            const orderItems = [{
                                'Menu_Item': {
                                    'itemName': order['Order_Items.Menu_Item.itemName'],
                                    'price': !isNaN(parseFloat(order['Order_Items.Menu_Item.price'])) ? parseFloat(order['Order_Items.Menu_Item.price']) : 0,
                                    'imageUrl': order['Order_Items.Menu_Item.imageUrl'],
                                },
                                quantity: !isNaN(order['Order_Items.quantity']) ? parseInt(order['Order_Items.quantity']) : 0,
                            }];
                            
                            // Tính tổng tiền của sản phẩm
                            const productTotal = orderItems.reduce((total, item) => {
                                return total + (item.quantity * item.Menu_Item.price);
                            }, 0);

                            // Tính tổng tiền sau khi trừ khuyến mãi (nếu có)
                            const discount = order['Promotion.code'] ? order['Promotion.discount_percentage'] : 0;
                            const discountAmount = productTotal * (discount / 100);
                            const totalAfterDiscount = productTotal - discountAmount;

                            // Lấy phương thức giao hàng và tính phí vận chuyển
                            const shippingFee = getShippingFee(order.deliveryMethod);

                            // Tính tổng tiền đơn hàng (sau khi trừ khuyến mãi và cộng phí vận chuyển)
                            const totalPrice = totalAfterDiscount + shippingFee;

                            return (
                                <tr key={index}>
                                    <td>{order.id}</td>
                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    <td>{order.customerInfo || 'Chưa có thông tin'}</td>
                                    
                                    <td>
                                        <div className='product-orderHistory'>
                                            <strong>Sản phẩm:</strong>
                                            <ul>
                                                {orderItems.length > 0 ? (
                                                    orderItems.map((item, i) => (
                                                        <li key={i}>
                                                            <div className='product-order'>
                                                                {item.Menu_Item.imageUrl && (
                                                                    <img 
                                                                        src={item.Menu_Item.imageUrl} 
                                                                        alt={item.Menu_Item.itemName} 
                                                                    />
                                                                )}
                                                                <div className="product-details">
                                                                    <p className="product-name">{item.Menu_Item.itemName}</p>
                                                                    <div className="product-quantity-price">
                                                                        <p><strong>X</strong> {item.quantity}</p>
                                                                        <p className='product-price'> {item.Menu_Item.price.toLocaleString('vi-VN')} đ</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p>Không có sản phẩm nào trong đơn hàng này</p>
                                                )}
                                            </ul>

                                            {/* Hiển thị thông tin khuyến mãi */}
                                            {order.Promotion && order.Promotion.code && (
                                                <div>
                                                    <p><strong>Khuyến mãi:</strong> {order.Promotion.code}</p>
                                                    <p><strong>Mô tả:</strong> {order.Promotion.description}</p>
                                                    <p><strong>Giảm giá:</strong> -{discountAmount.toLocaleString('vi-VN')} đ</p>
                                                </div>
                                            )}

                                            {/* Hiển thị tổng tiền */}
                                            <div className="total-price">
                                                <span><strong>Tổng tiền sản phẩm:</strong></span> 
                                                <span className="total-price-value">{productTotal.toLocaleString('vi-VN')} đ</span>
                                            </div>
                                                {discount > 0 && (
                                                    <p><strong>Giảm giá ({discount}%):</strong> -{discountAmount.toLocaleString('vi-VN')} đ</p>
                                                )}

                                            {/* Hiển thị phí vận chuyển */}
                                            <div className="shipping-fee">
                                                <span><strong>Phí vận chuyển: </strong></span>
                                                <span className="ship-price-value">{shippingFee.toLocaleString('vi-VN')} đ</span>
                                            </div>

                                            {/* Hiển thị thành tiền cuối cùng */}
                                            <div className="total-final-price">
                                                <span><strong>Thành tiền: </strong></span>
                                                <span className="final-price-value">{totalPrice.toLocaleString('vi-VN')} đ</span>
                                            </div>
                                        </div>     
                                    </td>

                                    <td>{order['Payment_Method.method_type']}</td>
                                    <td>{order.deliveryMethod}</td>
                                    <td>{order.notes || 'Không có ghi chú'}</td>
                                    <td>{order.orderStatus}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" className="no-orders">
                                Không có đơn hàng nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistory;
