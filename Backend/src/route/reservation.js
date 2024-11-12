import express from "express";
import reserController from '../controllers/reserController';


let router = express.Router();

let initReserRoutes = (app) => {
    // Reservation 
    router.post('/api/contact', reserController.handleContact);
    //Contact
    router.post('/api/reservation', reserController.handleReservation);
    //News
    router.get('/api/news', reserController.handleNews);
    router.get('/api/news/:slug', reserController.handleNewsDetails);

    return app.use("/", router);
}

module.exports = initReserRoutes;