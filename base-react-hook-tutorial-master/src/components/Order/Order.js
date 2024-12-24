import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { applyDiscount, createOrder, createMomoPayment } from "../../services/orderService";  // Import từ orderService.js
import './Order.scss';
import Breadcrumb from "../Header/Breadcrumb";
import { PayPalButton } from "react-paypal-button-v2";

const OrderPage = () => {
    let navigate = useNavigate();
    const [customerInfo, setCustomerInfo] = useState({
        fullName: "",
        phone: "",
        address: "",
        district: "",
        ward: "",
        note: ""
    });
    const [shippingMethod, setShippingMethod] = useState("Giao hàng tận nơi trong trường");
    const [paymentMethod, setPaymentMethod] = useState("Thanh toán khi nhận hàng");
    const [cartItems, setCartItems] = useState([]);
    const [discountCode, setDiscountCode] = useState("");
    const [notes, setNotes] = useState("");
    const [totalAmount, setTotalAmount] = useState(85000); // Tạm tính
    const [promoApplied, setPromoApplied] = useState(null); // Trạng thái áp dụng mã giảm giá
    const [discountAmount, setDiscountAmount] = useState(0);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
        if (name === 'note') {
            setNotes(value);  // Cập nhật giá trị cho trường ghi chú
        }
    };

    const handleApplyDiscount = async () => {
        try {
            const discountResponse = await applyDiscount(discountCode);
    
            // Kiểm tra nếu discountResponse có thuộc tính discount
            if (discountResponse && typeof discountResponse.discount === 'number') {
                const discountValue = discountResponse.discount;  // discount là số  
                const discountAmount = totalAmount * (discountValue / 100);
                setDiscountAmount(discountAmount);
    
                // Sử dụng giá trị discount chính xác từ discountResponse
                setPromoApplied(`Giảm ${discountValue}%`); // Hiển thị giảm giá đúng
            } else {
                alert("Giá trị giảm giá không hợp lệ.");
            }
        } catch (error) {
            console.error("Lỗi khi áp dụng mã giảm giá:", error);
            alert("Có lỗi xảy ra khi áp dụng mã giảm giá.");
        }
    };

    const handleCheckout = async () => {
        try {
            // Tính tổng giỏ hàng
            let newTotalAmount = cartItems.reduce((total, item) => {
                return total + item.priceTotal;  // Cộng tổng priceTotal của từng sản phẩm
            }, 0);
    
            // Áp dụng giảm giá nếu có
            if (discountAmount > 0) {
                newTotalAmount -= discountAmount; // Trừ đi số tiền giảm giá
            }
    
            // Tính phí vận chuyển
            const shippingFee = getShippingFee(); // Hàm lấy phí vận chuyển
            newTotalAmount += shippingFee; // Cộng phí vận chuyển vào tổng
    
            // Gửi dữ liệu đơn hàng
            const orderData = {
                customerInfo,
                cartItems,
                shippingMethod,
                paymentMethod,
                discountCode,
                totalAmount: newTotalAmount,
                notes 
            };
    
            await createOrder(orderData); // Gọi API tạo đơn hàng
            localStorage.removeItem('selectedItems');  // Xóa các sản phẩm đã chọn khỏi localStorage

            alert("Đặt hàng thành công!");
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("Có lỗi xảy ra khi đặt hàng!");
        }
    };

    useEffect(() => {
        const storedSelectedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];
        setCartItems(storedSelectedItems); 
    }, []);

    const getShippingFee = () => {
        switch (shippingMethod) {
            case "Giao hàng tận nơi trong trường":
                return 5000;
            case "Giao hàng ngoài trường":
                return 20000;
            default:
                return 0;  // Free shipping for "Lấy hàng tại canteen"
        }
    };
    
    const finalTotalAmount = totalAmount + getShippingFee() - discountAmount;

    useEffect(() => {
        // Tính toán lại tổng tiền khi có sự thay đổi về giỏ hàng
        const newTotalAmount = cartItems.reduce((total, item) => {
            const itemTotal = item["Menu_Item.price"] * item.quantity;  
            return total + itemTotal;
        }, 0);
        setTotalAmount(newTotalAmount);
    }, [cartItems]);

    const handleCart = () =>{
        navigate('/cart')
    }

    const onSuccess = (payment) => {
        console.log("Thanh toán thành công!", payment);
        setPaymentSuccess(true);
        alert("Thanh toán thành công!");
    };

    const onCancel = (data) => {
        console.log("Thanh toán bị hủy:", data);
        alert("Thanh toán bị hủy.");
    };

    const onError = (error) => {
        console.error("Lỗi khi thanh toán:", error);
        alert("Có lỗi xảy ra khi thanh toán.");
    };

    const handleMoMoPayment = async () => {
        try {
            const orderId = new Date().getTime(); // Unique order ID
            const orderInfo = "Thanh toán qua MoMo";

            const response = await createMomoPayment(finalTotalAmount, orderId, orderInfo);
            if (response && response.paymentUrl) {
                // Chuyển hướng người dùng đến trang thanh toán MoMo
                window.location.href = response.paymentUrl;
            }
        } catch (error) {
            console.error("Lỗi thanh toán MoMo:", error);
            alert("Có lỗi xảy ra khi thanh toán MoMo.");
        }
    };

    const breadcrumbItems = [
        { label: "Trang chủ", link: "/" },
        { label: "Thanh toán", link: "/order" },
    ];

    return (
        <div className="checkout-container">
            <Breadcrumb items={breadcrumbItems} />
            <div className="checkout-content">
                <div className="checkout-left">
                    <h2>THÔNG TIN NHẬN HÀNG</h2>
                    <form>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Họ tên"
                            value={customerInfo.fullName}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Địa chỉ"
                            value={customerInfo.address}
                            onChange={handleInputChange}
                        />
                        <select
                            name="district"
                            value={customerInfo.district}
                            onChange={handleInputChange}
                            placeholder="Quận"
                        >
                            <option value="Quận 5">Quận 5</option>
                            <option value="Quận 1">Quận 1</option>
                            <option value="Quận 3">Quận 3</option>
                            <option value="Quận 4">Quận 4</option>
                            <option value="Quận 8">Quận 8</option>
                            <option value="Quận 10">Quận 10</option>
                            <option value="Quận 11">Quận 11</option>
                            {/* Thêm các quận khác nếu cần */}
                        </select>
                        <input
                            type="text"
                            name="ward"
                            placeholder="Phường"
                            value={customerInfo.ward}
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="note"
                            placeholder="Ghi chú"
                            value={notes}
                            onChange={handleInputChange}
                        ></textarea>
                    </form>
                    <div className="note"> * LƯU Ý: Vận chuyển để đơn hàng chất lượng nhất chỉ giao các quận 1,3,5,10,11,4,8</div>
                </div>

                <div className="checkout-right">
                    <h2>ĐƠN HÀNG</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Thông tin sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Số tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="product-info">
                                        <img
                                            src={item["Menu_Item.imageUrl"]}
                                            alt={item["Menu_Item.itemName"]}
                                            className="product-image"
                                        />
                                        <span className="product-name">{item["Menu_Item.itemName"]}</span>
                                    </td>
                                    <td>{Number(item["Menu_Item.price"]).toLocaleString('vi-VN')} đ</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.priceTotal ? item.priceTotal.toLocaleString('vi-VN') : "0"} đ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <input
                        type="text"
                        placeholder="Nhập mã khuyến mãi"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button onClick={handleApplyDiscount}>Áp dụng</button>
                    {promoApplied && <div className="promo-applied">{promoApplied}</div>}

                    <div className="checkout-input">
                        <div className="ship-method">
                            <div className="title-method">Phương thức vận chuyển</div>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="Giao hàng tận nơi trong trường"
                                checked={shippingMethod === "Giao hàng tận nơi trong trường"}
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            <label>Giao hàng tận nơi trong trường (5.000 đ)</label>
                            <br />
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="Giao hàng ngoài trường"
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            <label>Giao hàng ngoài trường (20.000 đ)</label>
                            <br />
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="Lấy hàng tại canteen"
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            <label>Lấy hàng tại canteen</label>
                        </div>

                        <div className="payment-method">
                            <div className="title-method">Phương thức thanh toán</div>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Thanh toán khi nhận hàng"
                                checked={paymentMethod === "Thanh toán khi nhận hàng"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label>Thanh toán khi nhận hàng</label>
                            <br />
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Paypal"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label>Paypal</label>
                            <br />
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="MOMO"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label>MOMO</label>
                        </div>
                    </div>
                    {/* Hiển thị PayPal khi người dùng chọn Paypal */}
                    {paymentMethod === "Paypal" && (
                        <PayPalButton
                            amount={finalTotalAmount*0.042}
                            currency="USD"
                            onSuccess={onSuccess}
                            onCancel={onCancel}
                            onError={onError}
                            options={{
                                clientId: "ARoOsXEdJUez7GIMZlH1AlLvhT231X5DqX2DJYBIJAZVUoTDHVIlZ9U6SllTkHsj7s8wBnJPwut8SJFt",  // Thay thế bằng PayPal client ID của bạn
                            }}
                        />
                    )}

                    {paymentMethod === "MOMO" && (
                        <button onClick={handleMoMoPayment} className="btn-momo">Thanh toán MoMo</button>
                    )}

                    <div className="checkout-price">
                        <h5>Tạm tính: <span>{totalAmount ? totalAmount.toLocaleString('vi-VN'): "0"} đ </span></h5>
                        <h5>Phí vận chuyển: <span>{
                            shippingMethod === "Giao hàng tận nơi trong trường" ? "5.000 đ" :
                            shippingMethod === "Giao hàng ngoài trường" ? "20.000 đ" : "Miễn phí"
                        }</span></h5>
                        <h5>Khuyến mãi: <span> {promoApplied ? promoApplied : "0%"} </span></h5>
                        <h5>Tổng khuyến mãi: <span> -{discountAmount ? discountAmount.toLocaleString('vi-VN') : "0"} đ </span></h5>
                    </div>
                    <div className="checkout-total">
                        Tổng thanh toán: <span>{finalTotalAmount.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="btn-group">
                        <div className="back-cart" onClick={handleCart}><i className="fa-solid fa-angles-left" /> Quay về giỏ hàng</div>
                        {(paymentMethod === "Thanh toán khi nhận hàng" || paymentSuccess) && (
                            <button onClick={handleCheckout} className="btn-order">Đặt hàng</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
