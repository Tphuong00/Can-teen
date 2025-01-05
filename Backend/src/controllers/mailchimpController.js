import axios from 'axios';

const subscribeEmail = async (req, res) => {
  const { email } = req.body;

  // Kiểm tra email hợp lệ
  if (!email || !email.includes('@')) {
    return res.status(400).send('Email không hợp lệ!');
  }

  const API_KEY = '572a315d659a365d53ef68a58431d7d2-us3'; // Thay bằng API Key của bạn
  const LIST_ID = 'c24b0d5be9'; // Thay bằng List ID của bạn
  const DATACENTER = 'us3'; // Thay bằng Data center của bạn (từ API Key)

  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const data = {
    email_address: email,
    status: 'subscribed', // 'subscribed', 'unsubscribed', 'cleaned', hoặc 'pending'
  };

  try {
    // Gửi yêu cầu POST đến Mailchimp API
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).send('Đăng ký thành công!');
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu đến Mailchimp:', error.response?.data || error.message);
    res.status(500).send('Lỗi kết nối, vui lòng thử lại!');
  }
};

export default { subscribeEmail };
