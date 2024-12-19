import express from "express";
import mailchimpController from '../controllers/mailchimpController';

let router = express.Router();

let initMailChimpRoutes = (app) => {
    router.post('/api/subcriber', mailchimpController.subscribeEmail);


    return app.use("/", router);
}

module.exports = initMailChimpRoutes;
