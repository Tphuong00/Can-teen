require('dotenv').config();
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
    host: process.env.DB_HOST,
    dialect:'mysql',
    logging: false,
    port: process.env.DB_PORT,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Cho phép các kết nối không có chứng chỉ
        },
        connectTimeout: 60000,  // Tăng thời gian chờ kết nối lên 20 giây
    },
    pool: {
        max: 10, // Số lượng kết nối tối đa
        min: 0,  // Số lượng kết nối tối thiểu
        acquire: 60000, // Thời gian tối đa (ms) để có kết nối
        idle: 10000 // Thời gian tối đa để một kết nối không sử dụng
    }
});

let connectDB = async () =>{
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully');
    }catch(error){
        console.error('Unable to connect to the database: ', error);
    }
}


module.exports = connectDB;