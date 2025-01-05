import db from '../models/index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

exports.register = (req, res) => {
	if (
		!req.body.email ||
		!req.body.fullname ||
		!req.body.password
	) {
		return res.status(400).send({
			message: "All fields are required",
		});
	}

	const { email, fullname, password } = req.body;
	db.Users.findOne({
        attributes: ['email'],
        where: {email: email},
        raw: true,
        }).then((user) => {
		if (user) {
			return res.status(400).json({
				message: "User already exists",
			});
		}
		const newUser = new db.Users({
			email: email,
			fullName: fullname,
			password,
		});
		bcrypt.genSalt(10, (err, saltRounds) => {
			if (err) throw err;
			bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
				newUser
					.save()
					.then((user) => {
						res.status(200).json({
							message: "User created successfully",
							data: user,
						});
					})
					.catch(() => {
						res.status(400).json({
							message: "User creation failed",
						});
					});
			});
		});
	});
};

exports.login = (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({
			message: "All fields are required",
		});
	}

	db.Users.findOne({ 
        attributes: ['id','password', 'fullName', 'email', 'phoneNumber', 'address', 'roleID'],
        where: {email: email},
        raw: true, 
        }).then((user) => {
		if (!user) {
			return res.status(400).json({
				message: "User not found",
			});
		}
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch) {
				return res.status(400).json({
					message: "Mật khẩu không đúng",
				});
			}
			const payload = {
				user:{
					id: user.id,
					fullName: user.fullName,
					email: user.email,
					phoneNumber: user.phoneNumber,
					address: user.address,
					roleID: user.roleID
				}
			};
			jwt.sign(
				payload,
				process.env.JWT_SECRET,
				{ expiresIn: process.env.JWT_EXPIRES_IN },
				(err, token) => {
					if (err) throw err;

					res.cookie("token", token, {
						httpOnly: true,  // Bảo vệ cookie khỏi JavaScript trên client
  						sameSite: 'None',  // Yêu cầu cho Cross-Origin
						secure: process.env.NODE_ENV === "production",  // Chỉ gửi cookie qua HTTPS trong môi trường production
						maxAge:  30 * 24 * 60 * 60 * 1000,  // Thời gian sống của cookie (tính bằng mili giây)
					});
					res.status(200).json({
						message: "Login successful",
						token: token,
						data: user,
					});
				}
			);
		});
	});
};

exports.getuser = async (req, res) => {
	try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userId = req.user.id;

        const user = await db.Users.findByPk(userId, {
            attributes: ['id', 'email', 'fullName', 'address', 'phoneNumber', 'roleID'],
			raw: true
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            email: user.email,
            fullname: user.fullName,
            address: user.address,
            phonenumber: user.phoneNumber,
            roleID: user.roleID,
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        return res.status(500).json({ message: 'Error fetching user info' });
    }
};

exports.update = (req, res) => {
	const { email, fullname, address, phonenumber, roleID } = req.body;

	// Kiểm tra xem tất cả các trường có được cung cấp không
	if (!fullname || !address || !roleID || !phonenumber) {
		return res.status(400).json({
			message: "All fields are required",
		});
	}

	// Tìm và cập nhật thông tin người dùng
	db.Users.update(
		{
			fullName: fullname,
			address: address,
			phoneNumber: phonenumber,
			roleID: roleID
		},
		{
			where: { email: email }
		}
	).then((result) => {
		if (result[0] === 0) { // Kiểm tra nếu không có bản ghi nào được cập nhật
			return res.status(400).json({
				message: "User not found or no update made",
			});
		}
		res.status(200).json({
			message: "User updated successfully",
		});
	}).catch((error) => {
		console.error("Update failed:", error);
		res.status(500).json({
			message: "User update failed",
		});
	});
};

exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await db.Users.findOne({ where: { id: req.user.id }, raw: false });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
		console.log("Current password input:", currentPassword);
		console.log("Stored password hash:", user.password);
		console.log("Password match result:", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;

        await db.Users.update(
			{ password: hashedNewPassword },
			{ where: { id: req.user.id } }
		);
        
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "An error occurred while changing password" });
    }
};

