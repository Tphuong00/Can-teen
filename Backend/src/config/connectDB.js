const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('canteen', 'root', null,{
    host: '172.24.16.176'||'localhost' ,
    dialect:'mysql',
    logging: false,
    dialectOptions: {
        connectTimeout: 30000,  // Tăng thời gian chờ kết nối lên 20 giây
    },
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