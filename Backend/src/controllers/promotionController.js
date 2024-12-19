import db from '../models/index';

exports.applyPromotion = async (req, res) => {
    const { code} = req.body;
    try {
        // Sửa lại câu truy vấn để sử dụng 'where'
        const promotion = await db.Promotion.findOne({
            where: { code: code }  // Đảm bảo sử dụng 'where' đúng cách
        });

        if (!promotion) {
            return res.status(404).json({ error: 'Mã giảm giá không hợp lệ' });
        }

        const discount = parseFloat(promotion.discount_percentage);


        res.status(200).json({ discount });  
    } catch (error) {
        console.error("Lỗi khi áp dụng mã giảm giá:", error);
        res.status(500).json({ error: 'Lỗi khi áp dụng mã giảm giá' });
    }
};