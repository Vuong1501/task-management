const express = require('express');
const router = express.Router(); 

const controller = require("../../../api/v1/controllers/user.controller");

const authMiddelware = require("../middlewares/auth.middleware");


router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

router.get("/detail", authMiddelware.requireAuth, controller.detail);



module.exports = router; 