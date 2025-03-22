const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  credentialId: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now },
});
const User=mongoose.model("biometric", UserSchema);

module.exports = User;
