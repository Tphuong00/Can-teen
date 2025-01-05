import React, { useEffect } from 'react';

const MessengerChat = () => {
  useEffect(() => {
    // Tạo thẻ script để tải chatbox.js
    const script = document.createElement('script');
    script.src = "https://app.tudongchat.com/js/chatbox.js"; // URL của script chatbox
    script.async = true;
    script.onload = () => {
      // Sau khi script tải xong, khởi tạo chatbox
      const tudong_chatbox = new TuDongChat('pbVasmQYb2l3_knQol-3W');
      tudong_chatbox.initial(); // Khởi tạo chatbox
    };

    // Thêm script vào trang
    document.body.appendChild(script);

    // Cleanup: Loại bỏ script khi component bị unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Chạy chỉ một lần khi component mount

  return null; // Chạy một lần khi component mount
};

export default MessengerChat;
