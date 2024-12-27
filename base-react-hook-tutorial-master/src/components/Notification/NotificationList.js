import React from 'react';
import { useNotification } from './NotificationContext';
import { Button } from 'react-bootstrap';  

const NotificationList = () => {
    const { notifications, loading, markAsRead } = useNotification();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h3>Thông Báo</h3>
            {notifications.length === 0 ? (
                <p>Không có thông báo nào</p>
            ) : (
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification.id} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
