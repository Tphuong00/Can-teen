import React, { useEffect } from 'react';

const MessengerChat = () => {
  useEffect(() => {
    const loadFbSDK = () => {
      // Kiểm tra xem SDK Facebook đã được tải chưa
      if (window.FB) {
        console.log("FB SDK loaded"); 
        window.FB.XFBML.parse(); // Phân tích và render các thành phần Facebook (bao gồm Messenger Chat)
      } else {
        // Nếu chưa tải, thêm sự kiện để tải SDK
        const script = document.createElement('script');
        script.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
        script.async = true;
        document.body.appendChild(script);
            console.log("FB SDK not loaded yet");
        script.onload = () => {
          // Sau khi tải xong SDK, phân tích lại
          if (window.FB) { 
            window.FB.XFBML.parse();
          } 
        };
      }
    };

    loadFbSDK(); // Gọi hàm để tải SDK

  }, []); 

  return (
    <div>
      <div
        className="fb-customerchat"
        attribution="setup_tool"
        page_id="61570959760002" // Thay thế bằng Page ID của bạn
        theme_color="#0084ff"
        logged_in_greeting="Chào bạn, chúng tôi có thể giúp gì cho bạn?"
        logged_out_greeting="Chào bạn, hãy liên hệ với chúng tôi nhé!"
      ></div>
    </div>
  );
};

export default MessengerChat;
