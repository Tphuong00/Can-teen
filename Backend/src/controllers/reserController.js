import db from '../models/index';
import dayjs from 'dayjs';
import slugify from'slugify';

const handleReservation = async (req, res) => {
    try {
        if (
            !req.body.phonenumber ||
            !req.body.fullname ||
            !req.body.email ||
            !req.body. numberOfGuests ||
            !req.body.reservationDate ||
            !req.body.reservationTime
        ) {
            return res.status(400).send({
                message: "All fields are required",
            });
        } else {
            const { fullname, phonenumber, email, numberOfGuests, reservationDate, reservationTime } = req.body;  // Lấy dữ liệu từ request body
            const reservationdate = dayjs(reservationDate).format('YYYY-MM-DD');  // Chỉ lấy ngày
            const reservationtime = dayjs(`${reservationDate} ${reservationTime}`, 'YYYY-MM-DD hh:mm A').format('HH:mm:ss');

            // Tạo mới đặt bàn
            const newReservation = await db.Reservations.create({
                fullName: fullname,
                phoneNumber: phonenumber,
                email,
                reservation_time: reservationtime,
                reservation_date: reservationdate,
                number_of_people: numberOfGuests,
                status: false,  // Mặc định trạng thái là chưa xác nhận (false)
            });

            return res.status(200).json({
                message: 'Đặt bàn thành công',
                data: newReservation,
            });
        }
    } catch (error) {
        console.error('Error in send reservation:', error);
        return res.status(500).json({
            message: 'Lỗi đặt bàn',
            error: error.message,
        });
    }
};

const handleContact = async (req, res) => {
    try {
        if (
            !req.body.phonenumber ||
            !req.body.fullname ||
            !req.body.email ||
            !req.body. message 
        ) {
            return res.status(400).send({
                message: "All fields are required",
            });
        }else{
            const { fullname, phonenumber, email, message } = req.body;  // Lấy dữ liệu từ request body

            // Tạo mới thông tin liên hệ
            const newContact = await db.Support.create({
                fullName: fullname,
                phoneNumber: phonenumber,
                email,
                message
            });

            return res.status(200).json({
                message: 'Gửi thông tin thành công',
                data: newContact,
            });
        }
    } catch (error) {
        console.error('Error in send contact:', error);
        return res.status(500).json({
            message: 'Lỗi gửi thông tin liên hệ',
            error: error.message,
        });
    }
};

const handleNews = async (req, res) => {
    try {
        const newsList = await db.Event.findAll(); // Lấy tất cả các bài viết từ bảng news
        if (!newsList || newsList.length === 0) {
            return res.status(404).send('Không có bài viết nào');
        }
        res.json(newsList);  // Trả về danh sách bài viết
    } catch (error) {
        console.error('Error fetching news list:', error);
        res.status(500).send('Lỗi khi lấy danh sách bài viết: ' + error.message);
    }
};

const handleNewsDetails = async (req, res) => {
    try {
        const { slug } = req.params;

        const newsList = await db.Event.findAll();

        const news = newsList.find((newsItem) => {
            const generatedSlug = slugify(newsItem.title, { lower: true, strict: true }).replace(/djai/g, 'dai');
            return generatedSlug === slug;
        });

        if (!news) {
            return res.status(404).json({ error: 'News not found' });
        }

        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}


module.exports = {
    handleReservation: handleReservation,
    handleContact: handleContact,
    handleNews: handleNews,
    handleNewsDetails: handleNewsDetails
}