const mongoose = require("../config/db");

const candidateSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  state: { type: String, required: true },
  dob: { type: Date, required: true },
  voterid: { type: String, required: true, unique: true },
  phoneno: { type: String, required: true, minlength: 10, maxlength: 10 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userImage: { type: String }, // Store image URL, or use Buffer for file storage
  createdAt: { type: Date, default: Date.now }
});

const Candidate = mongoose.model("User", candidateSchema);
module.exports = Candidate;
