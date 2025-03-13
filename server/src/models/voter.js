// const db=require("../config/db");
// const userSchema = new db.Schema({
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["voter", "admin"], default: "voter" },
//     createdAt: { type: Date, default: Date.now }
//   });
//   const  modal=db.model("User",userSchema);
//   module.exports={modal};
  
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18 },
    city: { type: String, required: true },
    state: { type: String, required: true },
    dob: { type: Date, required: true },
    voterid: { type: String, required: true, unique: true },
    phone: { type: String, required: true, length: 10 },
    image: { type: String,default:undefined }, // Store image as URL or base64 string
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    voteStatus:{type:String,default:"Not Voted"}
  });

const User = mongoose.model("User", candidateSchema);
module.exports = User;
