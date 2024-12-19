import axios from 'axios';

const subscribeEmail = async (req, res) => {
  const { email } = req.body;
  // Kiểm tra email hợp lệ
  if (!email || !email.includes('@')) {
    return res.status(400).send('Email không hợp lệ!');
  }

  const formData = new URLSearchParams();
  formData.append('EMAIL', email);  // Trường 'EMAIL' là bắt buộc

  try {
    // Gửi yêu cầu POST đến Mailchimp
    const response = await axios.post(
      'https://gmail.us3.list-manage.com/subscribe/post?u=c831f7ad6bcbd30cef47f12b8&id=c24b0d5be9',
      formData
    );

    if (response.status === 200) {
      return res.status(200).send('Đăng ký thành công!');
    } else {
      return res.status(500).send('Đã có lỗi xảy ra, vui lòng thử lại!');
    }
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu đến Mailchimp:', error);
    return res.status(500).send('Lỗi kết nối, vui lòng thử lại!');
  }
};

export default { subscribeEmail };
