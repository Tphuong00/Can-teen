import axios from 'axios';

const subscribeEmail = async (req, res) => {
  const { email } = req.body;

  // Kiểm tra email hợp lệ
  if (!email || !email.includes('@')) {
    return res.status(400).send('Email không hợp lệ!');
  }

  const url = 'https://gmail.us3.list-manage.com/subscribe/post?u=c831f7ad6bcbd30cef47f12b8&amp;id=c24b0d5be9&amp;f_id=007531e1f0';

  const data = new URLSearchParams();
  data.append('EMAIL', email);  // Thêm trường EMAIL với giá trị là email người dùng nhập

  try {
    // Gửi yêu cầu POST đến URL đăng ký của Mailchimp
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.status(200).send('Đăng ký thành công!');
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu đến Mailchimp:', error.response?.data || error.message);
    res.status(500).send('Lỗi kết nối, vui lòng thử lại!');
  }
};

export default { subscribeEmail };
