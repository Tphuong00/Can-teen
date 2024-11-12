import db from '../models/index';
import user from '../models/user';
import CRUDService from '../services/CRUDService';
import cloudinary from '../config/cloudinary'; 
import fs from 'fs';


let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }



}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');

}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('post crud from server');

}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    console.log('-------------------------------------');
    console.log(data);
    console.log('-------------------------------------');

    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        // check user data not found

        return res.render('editCRUD.ejs', {
            user: userData
        })

    } else {

        return res.send('User not found')
    }

}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);

    return res.render('displayCRUD.ejs', {
        dataTable: allUsers
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send('delete user succeed')
    }
    else {
        return res.send('user not found')
    }
}

const postNews = async (req, res) => {
    try {
        // Kiểm tra nếu có file được tải lên
        if (!req.file) {
          return res.status(400).send('No image uploaded');
        }
  
        // Tải ảnh lên Cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path);
  
        const { title, content } = req.body;
        const imgURL = result.secure_url; // Lấy URL từ Cloudinary
  
        // Lưu vào cơ sở dữ liệu
        await db.Event.create({
          title,
          content:content,
          imageUrl: imgURL,
        });
  
        // Xóa file tạm sau khi tải lên
        fs.unlinkSync(req.file.path);
  
        res.send('News posted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while posting news');
    }
}



module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,

    postNews:postNews,
}