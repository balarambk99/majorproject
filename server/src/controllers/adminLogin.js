const Admin = require("../models/admin"); // Admin Model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if admin exists
 
        console.log("adimin",req.body);
        const admin = await Admin.findOne({email: username });
        if (!admin) {
            console.log("sucess admin")
            return res.status(400).json({ message: "Admin not found" });
        }

        // Validate password
       console.log(admin.password)
  
      const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) 
            {

            console.log("sucess amtcgh")
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
           console.log("sucess")
        res.json({ success: "Login successful", token, admin });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { adminLogin };
