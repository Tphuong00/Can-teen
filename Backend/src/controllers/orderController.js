import db from '../models/index';

exports.createOrder = async (req, res) => {
    const { customerInfo, cartItems, shippingMethod, paymentMethod, discountCode, totalAmount, notes } = req.body;
    try {
        let textcustomerInfo = `Tên: ${customerInfo.fullName}`+
        `SĐT: ${customerInfo.phone}`+
        `Địa chỉ: ${customerInfo.address}, ${customerInfo.ward}, ${customerInfo.district}`

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
            orderStatus: 'Đã đặt hàng',  // Trạng thái mặc định của đơn hàng
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
        // Sử dụng findAll thay vì findOne để lấy tất cả các đơn hàng của người dùng
        const orders = await db.Orders.findAll({
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
                    attributes: ['id', 'code', 'discount_percentage'],
                    required: false
                }
            ],
            raw: true
        });     

        // Nếu không tìm thấy đơn hàng
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const groupedOrders = orders.reduce((acc, order) => {
            // Kiểm tra nếu order đã có trong kết quả
            const orderIndex = acc.findIndex(o => o.id === order.id);

            if (orderIndex === -1) {
                // Nếu chưa có, thêm đơn hàng mới vào
                acc.push({
                    ...order,
                    orderItems: [{
                        id: order['Order_Items.id'],
                        itemID: order['Order_Items.itemID'],
                        quantity: order['Order_Items.quantity'],
                        price: order['Order_Items.price'],
                        Menu_Item: {
                            id: order['Order_Items.Menu_Item.id'],
                            itemName: order['Order_Items.Menu_Item.itemName'],
                            price: order['Order_Items.Menu_Item.price'],
                            imageUrl: order['Order_Items.Menu_Item.imageUrl']
                        }
                    }],
                    paymentMethods: [{
                        id: order['Payment_Method.id'],
                        method_type: order['Payment_Method.method_type']
                    }],
                    promotions: [{
                        id: order['Promotion.id'],
                        code: order['Promotion.code'],
                        description: order['Promotion.description']
                    }]
                });
            } else {
                // Nếu đã có, chỉ cần thêm Order_Item vào
                acc[orderIndex].orderItems.push({
                    id: order['Order_Items.id'],
                    itemID: order['Order_Items.itemID'],
                    quantity: order['Order_Items.quantity'],
                    price: order['Order_Items.price'],
                    Menu_Item: {
                        id: order['Order_Items.Menu_Item.id'],
                        itemName: order['Order_Items.Menu_Item.itemName'],
                        price: order['Order_Items.Menu_Item.price'],
                        imageUrl: order['Order_Items.Menu_Item.imageUrl']
                    }
                });
            }
            return acc;
        }, []);

        res.status(200).json({
            message: 'Lấy thông tin đơn hàng thành công',
            data: groupedOrders
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin đơn hàng' });
    }
};

