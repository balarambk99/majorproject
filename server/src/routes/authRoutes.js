const express = require("express");
const { register, login, sendOtpController, verifyOTP } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp",sendOtpController);
router.post("/verify-otp",verifyOTP)
module.exports = router;
