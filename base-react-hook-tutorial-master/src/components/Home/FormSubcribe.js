import React, { useState } from 'react';
import "./FormSubcribe .scss";
import {FormSubcribe} from "../../services/userService";
import { toast } from 'react-toastify';

const SubscribeForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo FormData để gửi email
    const formData = new FormData();
    formData.append('EMAIL', email);  // Đảm bảo tên trường là 'EMAIL' (theo Mailchimp yêu cầu)

    try {
      const response = await FormSubcribe(email);

      if (response) {
        toast.success('Đăng ký thành công!');
      } else {
        toast.error('Đã có lỗi xảy ra, vui lòng thử lại!');
      }
    } catch (error) {
      toast.error('Lỗi kết nối, vui lòng thử lại!');
    }
  };

  return (
    <div className="slide-subcribeForm">
      <div className='subscribe-form'>
        <h2>Đăng ký nhận tin tức mới</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
          />
          <button type="submit">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default SubscribeForm;
