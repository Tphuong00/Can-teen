import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import viewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";
import cors from "cors";
import passport from'passport';


import initWebRoutes from "./route/web";
import initUserRoutes from "./route/users";
import iniReserRoutes from "./route/reservation";
import initCheckAuthRoutes from "./route/checkAuth";
import initProductRoutes from "./route/product";
import initCartRoutes from "./route/cart";
import initOrderRoutes from "./route/order";
import initPromotionRoutes from "./route/promotion";
import initmailchimpRoutes from'./route/mailchimp';
import initPaymentRoutes from './route/payment';
import initNotiRoutes from './route/notifications';
import "./config/passportSetup";

require("dotenv").config();
const multer = require('multer');

let app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors({ credentials: true, origin: "https://can-teen-production.up.railway.app" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

// Đảm bảo không dùng session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


viewEngine(app);

initWebRoutes(app);
initUserRoutes(app);
iniReserRoutes(app);
initCheckAuthRoutes(app);
initProductRoutes(app);
initCartRoutes(app);
initOrderRoutes(app);
initPromotionRoutes(app);
initmailchimpRoutes(app);
initPaymentRoutes(app);
initNotiRoutes(app);

connectDB();

// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', process.env.REACT_URL);

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

app.use((req, res)=>{
    return res.send('404 not found');
})

let PORT = process.env.PORT || 8080;

app.listen(PORT,'0.0.0.0', () =>{
    console.log("Backend is running on the port: " + PORT);
})


