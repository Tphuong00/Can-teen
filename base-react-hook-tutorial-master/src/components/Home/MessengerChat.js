import React, { useEffect } from 'react';

const MessengerChat = () => {
  useEffect(() => {
    const loadFbSDK = () => {
      if (!window.FB) {
        const script = document.createElement('script');
        script.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = () => {
          window.FB?.XFBML.parse();
        };
      }
    };
    loadFbSDK();
  }, []);

  return (
    <>
      <div id="fb-root"></div>
      <div
        className="fb-customerchat"
        attribution="setup_tool"
        page_id="545551111967077" // Thay bằng Page ID của bạn
        theme_color="#0084ff"
        logged_in_greeting="Chào bạn, chúng tôi có thể giúp gì cho bạn?"
        logged_out_greeting="Chào bạn, hãy liên hệ với chúng tôi nhé!"
      ></div>
    </>
  );
};

export default MessengerChat;
