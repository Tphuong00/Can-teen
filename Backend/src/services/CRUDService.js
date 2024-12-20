import bcrypt from 'bcryptjs';
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

let createNewUser =async(data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.Users.create({
                userName: data.userName,
                fullName: data.fullName,
                email: data.email,
                password: hashPasswordFromBcrypt,
                phoneNumber: data.phoneNumber,
                address: data.address,
                roleID: data.roleID
            })
            resolve('create new user succeed')
        }catch (e) {
            reject(e);
        }
    })
    
}
let hashUserPassword = (password) =>{
    return new Promise(async (resolve, reject) =>{
        try{
            let hashPassword = await bcrypt.hashSync(password, saltRounds);
            resolve(hashPassword);
        }catch(e){
            reject(e);
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.Users.findAll({
                raw: true,
            });
            resolve(users)
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { id: userId },
                raw: true,

            });

            if (user) {
                resolve(user)
            } else {
                resolve({})
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { id: data.id },

            })
            if (user) {
                user.fullName = data.fullName;
                user.phoneNumber = data.phoneNumber;
                user.address = data.address;

                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);

            } else {
                resolve();

            }

        } catch (e) {
            console.log(e);
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { id: userId }
            })
            if (user) {
                await user.destroy();

            }

            resolve();

        } catch (e) {
            reject(e);
        }
    })
}



module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}