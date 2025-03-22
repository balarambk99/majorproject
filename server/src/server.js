require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
//const multer = require("multer");
const path = require("path");  

const app = express();
const User=require("./models/user");
const crypto = require("crypto");

app.use(express.json({limit: "50mb"}));  
app.use(express.urlencoded({ extended: true,limit:"50mb" }));
app.use(cors());

connectDB();
const generateChallenge = () => {
    return crypto.randomBytes(32).toString("base64");
  };

  
  
  // Generate WebAuthn challenge for biometric registration
  app.post("/auth/generate-challenge", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
  
    const challenge = generateChallenge();
    res.json({
      rp: { name: "E-Voting System" },
      user: { id: email, name: email, displayName: email },
      challenge,
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
    });
  });
  app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

  
  // Register biometric credential
  app.post("/auth/register-biometric", async (req, res) => {
    const { email, credentialId, publicKey } = req.body;
  
    try {
      let user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
  
      user.credentialId = credentialId;
      user.publicKey = publicKey;
      await user.save();
  
      res.json({ success: true, message: "Biometric registered successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error });
    }
  });
  
  // Verify biometric login
  const eventsROute=require("./routes/eventRoutes");
 
  app.post("/auth/verify-biometric", async (req, res) => {
    const { email, credentialId } = req.body;
    const user = await User.findOne({ email });
  
    if (!user || user.credentialId !== credentialId) {
      return res.status(400).json({ success: false, message: "Biometric authentication failed" });
    }
  
    res.json({ success: true, message: "Biometric authentication successful" });
  });


app.post("/test", (req, res) => {
    console.log("Test Route Received:", req.body);
    res.json({ received: req.body });
});
const bio=require("./routes/biometric");
app.use("/biometric",bio);

const getVoter=require("./routes/voter");
app.use("/event",eventsROute)
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);
const addCandidate=require("./routes/adminRoutes");
const authenticateToken = require("./middlewars/authMiddleware");
app.use("/admin",addCandidate);
app.use("/voter",getVoter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
