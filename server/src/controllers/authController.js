const Candidate = require("../models/voter");
const OTP = require("../models/otp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via Email
const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP for Verification",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return otp;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return null;
  }
};

// Register User (Step 1)
const register = async (req, res) => {
  try {
    const { firstName, lastName, age, city, state, dob, voterid, phone, image, email, pass } = req.body;
    if (!firstName || !lastName || !age || !city || !state || !dob || !voterid || !phone || !email || !pass) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCandidate = await Candidate.findOne({ voterid });
    if (existingCandidate) return res.status(400).json({ error: "Voter ID already registered" });

    const otp = generateOTP();
    // Save OTP in MongoDB (upsert: create new or update existing)
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true }
    );

    const sent = await sendOTP(email, otp);
    if (!sent) return res.status(500).json({ error: "Failed to send OTP" });

    // Hash password and create candidate
    const hashedPassword = await bcrypt.hash(pass, 10);
    const candidate = new Candidate({
      firstName,
      lastName,
      age,
      city,
      state,
      dob,
      voterid,
      phone,
      email,
      password: hashedPassword,
      image,
    });
    await candidate.save();

    return res.status(201).json({
      success: true,
      message: "OTP sent to email for verification.",
      email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Verify OTP (Step 2)
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) return res.status(400).json({ error: "OTP expired or not found. Request a new one." });

    // Check if OTP has expired
    if (otpRecord.expiresAt < Date.now()) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    if (otpRecord.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    // OTP verified; remove the OTP document
    await OTP.deleteOne({ email });

    const user = await Candidate.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token: generateToken(user._id),
      data: user,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Login User (Step 1)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await Candidate.findOne({ email });
    if (!candidate || !(await bcrypt.compare(password, candidate.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const otp = generateOTP();
    // Save OTP in MongoDB (upsert: create new or update existing)
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true }
    );

    const sent = await sendOTP(email, otp);
    if (!sent) return res.status(500).json({ error: "Failed to send OTP" });

    return res.status(200).json({
      success: true,
      message: "OTP sent to email for verification.",
      email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Resend OTP
const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = generateOTP();
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true }
    );

    const sent = await sendOTP(email, otp);
    if (!sent) return res.status(500).json({ error: "Failed to send OTP" });

    return res.status(200).json({ success: true, message: "OTP sent successfully.", email });
  } catch (error) {
    console.error("sendOtpController error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = { register, verifyOTP, sendOtpController, login };
