import axios from 'axios';

const subscribeEmail = async (req, res) => {
  const { email } = req.body;

  // Kiểm tra email hợp lệ
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email không hợp lệ!' });
  }

  const url = 'https://us3.list-manage.com/subscribe/post';
  const formData = new URLSearchParams();
  formData.append('u', 'c831f7ad6bcbd30cef47f12b8'); // Thay bằng user ID của bạn
  formData.append('id', 'c24b0d5be9'); // Thay bằng list ID của bạn
  formData.append('EMAIL', email);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 200) {
      res.status(200).json({ message: 'Đăng ký thành công!' });
    } else {
      res.status(response.status).json({ message: 'Lỗi khi đăng ký!' });
    }
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu đến Mailchimp:', error.message);
    res.status(500).json({ message: 'Lỗi kết nối, vui lòng thử lại!' });
  }
};

export default { subscribeEmail };
