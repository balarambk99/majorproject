const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/online-voting", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.error("MongoDB Connection Error:", err));

// // Define Admin Schema
const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password before saving
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // ✅ Call next() to continue
});

const Admin = mongoose.model("Admin", AdminSchema);

// Function to create admin
const createAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash("123456", 10); // Hash password
        console.log("Creating Admin...");

        const newAdmin = await Admin.create({
            email: "balaram@example.com",
            name: "Beeka",
            password: hashedPassword,
        });

        console.log("Admin created successfully:", newAdmin);
    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        mongoose.connection.close(); // Close connection after operation
    }
};



module.exports = Admin;
