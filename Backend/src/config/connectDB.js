const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('canteen', 'root', null,{
    host: 'localhost' || 'https://can-teen.onrender.com',
    dialect:'mysql',
    logging: false
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