require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
//const multer = require("multer");
const path = require("path");  

const app = express();


app.use(express.json({limit: "50mb"}));  
app.use(express.urlencoded({ extended: true,limit:"50mb" }));
app.use(cors());

connectDB();


app.post("/test", (req, res) => {
    console.log("Test Route Received:", req.body);
    res.json({ received: req.body });
});

const getVoter=require("./routes/voter");

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);
const addCandidate=require("./routes/adminRoutes");
app.use("/admin",addCandidate);
app.use("/voter",getVoter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
