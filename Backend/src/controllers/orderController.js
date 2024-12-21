import db from '../models/index';

exports.createOrder = async (req, res) => {
    const { customerInfo, cartItems, shippingMethod, paymentMethod, discountCode, totalAmount, notes } = req.body;
    try {
        let textcustomerInfo = `Tên: ${customerInfo.fullName}/n
        SĐT: ${customerInfo.phone}/n
        Địa chỉ: ${customerInfo.address}, ${customerInfo.ward}, ${customerInfo.district}`

    let promoCodeID = null;
    if (discountCode) {
        try {
            const promo = await db.Promotion.findOne({
                where: {
                    code: discountCode,  
                }
            });
            if (promo) {
                promoCodeID = promo.id;  // Nếu tìm thấy mã khuyến mãi, lấy ID của nó
            } else {
                return res.status(400).json({ message: 'Mã khuyến mãi không hợp lệ' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Có lỗi xảy ra khi kiểm tra mã khuyến mãi' });
        }
    }

    const paymentMethodMapping = {
        'Thanh toán khi nhận hàng': 'COD',  // Ánh xạ "Thanh toán khi nhận hàng" thành "COD"
        'Paypal': 'PAYPAL',
        'MOMO': 'MOMO',
    };

    // Kiểm tra xem paymentMethod có ánh xạ hay không
    const paymentMethodInDB = paymentMethodMapping[paymentMethod];
    if (!paymentMethodInDB) {
        return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' });
    }
    let paymentMethodID = null;
        if (paymentMethodInDB)  {
        try {
            const payment = await db.Payment_Methods.findOne({
                where: {
                    method_type: paymentMethodInDB,  // Tìm theo tên phương thức thanh toán
                }
            });

            if (payment) {
                paymentMethodID = payment.id;  // Lấy id của phương thức thanh toán
            } else {
                return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Có lỗi xảy ra khi kiểm tra phương thức thanh toán' });
        }
    }
        // Tạo đơn hàng mới
        const order = await db.Orders.create({
            userID: cartItems[0].userID,
            customerInfo: textcustomerInfo,
            pricetotal: totalAmount,  // Giảm giá (nếu có) được trừ từ tổng giá trị
            orderStatus: 'Pending',
            deliveryMethod: shippingMethod,
            promoCode: promoCodeID,
            paymentID: paymentMethodID,  // Lưu phương thức thanh toán
            notes:notes,
            createdAt: new Date(),
        });

        // Thêm các item vào đơn hàng
        for (let item of cartItems) {
            await db.Order_Items.create({
                orderID: order.id,
                itemID: item.itemID,
                quantity: item.quantity,
                price: item.priceTotal,
            });
        }
        console.log("Order successfully");
        res.status(201).json({
            message: 'Đơn hàng được tạo thành công',
            order,
        });
    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi tạo đơn hàng' });
    }
};

// Nhận kết quả thanh toán từ frontend
exports.paymentResult = async (req, res) => {
    const { orderID, paymentStatus } = req.body;

    try {
        const order = await db.Orders.findByPk(orderID);

        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        if (paymentStatus === 'success') {
            // Cập nhật trạng thái đơn hàng thành 'Paid'
            await order.update({ orderStatus: 'Paid' });
            res.json({ message: 'Thanh toán thành công và đơn hàng đã được thanh toán' });
        } else {
            // Cập nhật trạng thái đơn hàng thành 'Failed'
            await order.update({ orderStatus: 'Failed' });
            res.status(400).json({ message: 'Thanh toán thất bại' });
        }
    } catch (error) {
        console.error('Lỗi khi xử lý kết quả thanh toán:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xử lý kết quả thanh toán' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const order = await db.Orders.findOne({
            where: { userID: req.user.id },
            attributes: ['id', 'userID', 'pricetotal', 'orderStatus', 'createdAt', 'customerInfo', 'deliveryMethod', 'notes'],
            include: [
                {
                    model: db.Order_Items,
                    attributes: ['id', 'itemID', 'quantity', 'price'],
                    include: [
                        {
                            model: db.Menu_Items,
                            attributes: ['id', 'itemName', 'price', 'imageUrl']
                        }
                    ]
                },
                {
                    model: db.Payment_Methods,
                    attributes: ['id', 'method_type']
                },
                {
                    model: db.Promotion,
                    attributes: ['id', 'code', 'description']
                }
            ],
            raw: true
        });     

        // Nếu không tìm thấy đơn hàng
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Trả về thông tin chi tiết của đơn hàng
        res.status(200).json({
            message: 'Lấy thông tin đơn hàng thành công',
            data: order
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin đơn hàng' });
    }
};

