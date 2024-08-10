const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];

        const user = await User.findOne({
            token: token,
            deleted: false
        }).select("-password");

        if(!user){
            res.json({
                code: 400,
                massage: "Token không hợp lệ!"
            });
            return;
        }
        req.user = user; // gắn thêm key user vào object req
        next();
    } else {
        res.json({
            code: 400,
            massage: "Vui lòng gửi theo token!"
        });
    }
}