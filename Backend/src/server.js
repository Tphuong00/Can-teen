import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import viewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";
import cors from "cors";

import initWebRoutes from "./route/web";
import initUserRoutes from "./route/users";
import iniReserRoutes from "./route/reservation";
import initCheckAuthRoutes from "./route/checkAuth";
import initProductRoutes from "./route/product";
import initCartRoutes from "./route/cart";

require("dotenv").config();
const multer = require('multer');

let app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors({ credentials: true, origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());


viewEngine(app);

initWebRoutes(app);
initUserRoutes(app);
iniReserRoutes(app);
initCheckAuthRoutes(app);
initProductRoutes(app);
initCartRoutes(app);

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

let port = process.env.PORT;

app.listen(port, () =>{
    console.log("Backend is running on the port: " + port);
})


