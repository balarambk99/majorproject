require("dotenv").configDotenv();
const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // Read from .env
     console.log(process.env.MONGO_URI)
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Stop server if DB connection fails
  }
};

module.exports = connectDB;
