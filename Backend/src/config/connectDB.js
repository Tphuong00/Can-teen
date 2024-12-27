const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, 'root', process.env.DB_PASSWORD,{
    host: "mysql.railway.internal",
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