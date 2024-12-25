import db from '../models/index';

exports.applyPromotion = async (req, res) => {
    const { code} = req.body;
    const userId = req.user.id; // Lấy userId từ middleware

    try {
        // Sửa lại câu truy vấn để sử dụng 'where'
        const promotion = await db.Promotion.findOne({
            where: { code: code }  
        });
        if (!promotion) {
            return res.status(404).json({ error: 'Mã giảm giá không hợp lệ' });
        }

        const dateFrom = new Date(promotion.date_from);
        const dateUntil = new Date(dateFrom.getTime() + promotion.date_until * 24 * 60 * 60 * 1000);  // date_until là số ngày, chuyển sang milliseconds
    
        const currentDate = new Date();;
        // 3. Kiểm tra thời gian áp dụng mã giảm giá
        if (currentDate < dateFrom) {
          return res.status(400).json({ error: 'Mã giảm giá chưa bắt đầu áp dụng' });
        }
    
        if (currentDate > dateUntil) {
          // 4. Nếu mã đã hết hạn, xóa mã khỏi cơ sở dữ liệu
          await db.Promotion.destroy({
            where: { code: code }
          });
          return res.status(400).json({ error: 'Mã giảm giá đã hết hạn và đã bị xóa khỏi hệ thống' });
        }
    
        // 5. Kiểm tra xem người dùng đã sử dụng mã khuyến mãi này chưa
        const usedPromotion = await db.UserPromotions.findOne({
          where: { userID: userId, promoID: promotion.id }
        });
    
        if (usedPromotion) {
          return res.status(400).json({ error: 'Mã giảm giá này đã được sử dụng rồi' });
        }
    
        // 6. Lưu thông tin mã giảm giá đã sử dụng vào bảng UsedPromotions
        await db.UserPromotions.create({
            userID: userId, 
            promoID: promotion.id
        });

        const discount = parseFloat(promotion.discount_percentage);


        res.status(200).json({ discount });  
    } catch (error) {
        console.error("Lỗi khi áp dụng mã giảm giá:", error);
        res.status(500).json({ error: 'Lỗi khi áp dụng mã giảm giá' });
    }
};