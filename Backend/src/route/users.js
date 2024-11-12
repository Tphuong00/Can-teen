import express from "express";
import userController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

let router = express.Router();

let initUserRoutes = (app) => {

    router.post("/api/register", userController.register);
    router.post("/api/login", userController.login);
    router.put("/api/update", authMiddleware, userController.update);
    router.put( "/api/update/password", authMiddleware, userController.updatePassword);
    router.get("/api/getuser", authMiddleware, userController.getuser);


    return app.use("/", router);
}

module.exports = initUserRoutes;
