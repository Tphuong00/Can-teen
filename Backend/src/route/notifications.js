import express from "express";
import NotiController from '../controllers/notifitionController';
import authMiddleware from '../middleware/authMiddleware';

let router = express.Router();

let initNotiRoutes = (app) => {
    
    router.put('/api/mark-as-read/:id', authMiddleware, NotiController.markAsRead);
    router.post('/api/noti/create', authMiddleware, NotiController.createNotification); 
    router.get('/api/noti/:userID', authMiddleware, NotiController.getNotifications);


    return app.use("/", router);

}

module.exports = initNotiRoutes;