import React from 'react';
import { useNotification } from './NotificationContext';
import { Button } from 'react-bootstrap';  
import './Noti.scss'; // Import file SCSS

const NotificationList = () => {
    const { notifications, loading, markAsRead } = useNotification();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="notification-container">
            {notifications.length === 0 ? (
                <p>Không có thông báo nào</p>
            ) : (
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification.id} className="notification-item">
                            <div className="notification-content">
                                <p>{notification.message}</p>
                                <Button
                                    color={notification.is_read ? 'secondary' : 'primary'}
                                    onClick={() => markAsRead(notification.id)}
                                    disabled={notification.is_read}
                                >
                                    {notification.is_read ? 'Đã đọc' : 'Đánh dấu là đã đọc'}
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationList;
