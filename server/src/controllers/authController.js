const Candidate = require("../models/voter");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Temporary storage for OTPs (should use Redis in production)
const otpStorage = {};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (email, otp) => {
  try {
    console.log(process.env.SMTP_PASS);
    console.log(process.env.SMTP_USER)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Use 587 instead of 465
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Bypass certificate errors
      }
    });
    console.log(email);

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

const register = async (req, res) => {
  try {
    console.log("Registering user...");
    const { firstName, lastName, age, city, state, dob, voterid, phone, image, email, pass } = req.body;

    if (!firstName || !lastName || !age || !city || !state || !dob || !voterid || !phone || !email || !pass) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCandidate = await Candidate.findOne({ voterid });
    if (existingCandidate) {
      return res.status(400).json({ error: "Voter ID already registered" });
    }

    // Generate OTP
    const otp = generateOTP();
    otpStorage[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    const send = await sendOTP(email, otp);
    if (!send) return res.status(500).json({ error: "Failed to send OTP" });

    // Hash password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Save candidate
    const candidateData = { firstName, lastName, age, city, state, dob, voterid, phone, email, password: hashedPassword };
    if (image) candidateData.image = image;

    const candidate = new Candidate(candidateData);
    await candidate.save();

    // Remove password before sending response
    const { password, ...candidateWithoutPassword } = candidate.toObject();

    return res.status(201).json({
      success: true,
      message: "OTP sent to email for verification.",
      otp,
      data: candidateWithoutPassword,
      token: generateToken(candidate._id),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("User login attempt:", username);

    const candidate = await Candidate.findOne({ email: username });
    if (!candidate || !(await bcrypt.compare(password, candidate.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate OTP
    const otp = generateOTP();
    otpStorage[username] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    const send = await sendOTP(username, otp);
    if (!send) return res.status(500).json({ error: "Failed to send OTP" });

    // Remove password before sending response
    const { password: _, ...candidateWithoutPassword } = candidate.toObject();

    return res.json({
      success: true,
      message: "OTP sent to email for verification.",
      otp,
      data: candidateWithoutPassword,
      token: generateToken(candidate._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("OTP request received for:", email);

    if (!email) return res.status(400).json({ error: "Email is required" });

    // Generate and store OTP
    const otp = generateOTP();
    otpStorage[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    const send = await sendOTP(email, otp);
    if (!send) return res.status(500).json({ error: "Failed to send OTP" });

    return res.status(200).json({ success: true, message: "OTP sent successfully.", otp });
  } catch (error) {
    console.error("sendOtpController error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = { register, sendOtpController, login };
