import React, { createContext, useState, useContext, useEffect } from 'react';
import { getNotifications,  markAsReadApi } from '../../services/notiService';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const response = await getNotifications(); // Call service to get notifications
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            // Call the service to mark notification as read
            await markAsReadApi(id);
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === id
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, loading, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
