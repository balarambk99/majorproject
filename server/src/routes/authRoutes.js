const express = require("express");
const { register, login, sendOtpController } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp",sendOtpController)
module.exports = router;
