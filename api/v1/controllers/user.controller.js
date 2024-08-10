const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");

const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");

//[POST]/api/v1/users/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);
    
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if(existEmail){
        res.json({
            code: 400,
            massage: "Email đã tồn tại!"
        });
    } else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: generateHelper.generateRandomString(30)
        });

        user.save();
        const token = user.token; 
        res.cookie("token", token);

        res.json({
            code: 200,
            massage: "Tạo tài khoản thành công!",
            token: token
        });
    }
};

//[POST]/api/v1/users/login
module.exports.login = async (req, res) => {
    
    const email = req.body.email;
    const password = req.body.password;

   
    const user = await User.findOne({
        email: email,
        deleted: false
    });


    if(!user){
        res.json({
            code: 400,
            massage: "Email không tồn tại!",
        });
        return;
    }

    if(md5(password) !== user.password){
        res.json({
            code: 400,
            massage: "Sai mật khẩu!",
        });
        return;
    }

    const token = user.token; 
    res.cookie("token", token);

    res.json({
        code: 200,
        massage: "Đăng nhập thành công!",
        token: token
    });
};

//[POST]/api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    //Kiểm tra trong db xem có email nào như email gửi lên không
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        res.json({
            code: 400,
            massage: "Email không tồn tại!",
        });
        return;
    }

    const otp = generateHelper.generateRandomNumber(8);
    //Lưu data vào DB
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    //Gửi otp qua mail của user
    const subject = "Mã OTP xác nhận lấy lại mật khẩu";
    const html = `
        Mã OTP lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong 3 phút).
        Vui lòng không chia sẻ mã otp này với ai.
    `
    sendMailHelper.sendMail(email, subject, html);


    res.json({
        code: 200,
        massage: "Đã gửi mã otp qua email"
    });
    
};

//[POST]/api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
   
    const email = req.body.email;
    const otp = req.body.otp;
    
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result){
        res.json({
            code: 400,
            massage: "Mã otp không hợp lệ!",
        });
        return;
    }
    const user = await User.findOne({
        email: email
    });

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        massage: "Xác thực thành công",
        token: token
    });
    
};

//[POST]/api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
   
    const token = req.body.token;
    const password = req.body.password;

    const user = await User.findOne({
        token: token
    });

    if(md5(password) === user.password){
        res.json({
            code: 400,
            massage: "Mật khẩu mới phải khác mật khẩu cũ",
        });
        return;
    }
    
    //Cập nhật lại mật khẩu
    await User.updateOne({
        token: token
    }, {
        password: md5(password)
    });


    res.json({
        code: 200,
        massage: "Đổi mật khẩu thành công!",
    });
    
};

//[GET]/api/v1/users/detail
module.exports.detail = async (req, res) => {
    try {
        res.json({
            code: 200,
            massage: " thành công!",
            info: req.user
        });
    } catch (error) {
        res.json({
            code: 400,
            massage: "Lỗi!",
        });
    }
    
    
};
