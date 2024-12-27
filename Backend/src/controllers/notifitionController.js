import db from '../models/index';

exports.getNotifications = async (req, res) => {
    try {
        const { userID, message } = req.body;  // Lấy thông tin userID và message từ body request

        if (!userID || !message) {
            return res.status(400).json({ message: "userID và message là bắt buộc" });
        }

        const newNotification = await db.Notification.create({
            userID,
            message,
            is_read: false, // Mặc định thông báo chưa được đọc
            createdAt: new Date()
        });

        return res.status(201).json({ message: "Thông báo đã được tạo thành công", notification: newNotification });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Đã có lỗi xảy ra khi tạo thông báo" });
    }
}
exports.createNotification = async (req, res) => {
    try {
        const { userID } = req.params;  // Lấy userID từ params

        if (!userID) {
            return res.status(400).json({ message: "userID không hợp lệ" });
        }

        const notifications = await db.Notification.findAll({
            where: { userID },
            order: [['createdAt', 'DESC']] // Sắp xếp thông báo theo ngày tạo mới nhất
        });

        if (notifications.length === 0) {
            return res.status(404).json({ message: "Không có thông báo nào" });
        }

        return res.status(200).json({ notifications });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Đã có lỗi xảy ra khi lấy thông báo" });
    }
}
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;  // Lấy id của thông báo từ params

        const notification = await db.Notification.findByPk(id);  // Tìm thông báo theo id

        if (!notification) {
            return res.status(404).json({ message: "Thông báo không tồn tại" });
        }

        notification.is_read = true;  // Đánh dấu thông báo là đã đọc
        await notification.save();  // Lưu lại thay đổi

        return res.status(200).json({ message: "Thông báo đã được đánh dấu là đã đọc", notification });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Đã có lỗi xảy ra khi đánh dấu thông báo là đã đọc" });
    }
}
