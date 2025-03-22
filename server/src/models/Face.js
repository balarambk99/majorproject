const mongoose = require("mongoose");

const FaceSchema = new mongoose.Schema({
  voterid: { type: String, required: true, unique: true },
  face: { type: Array, required: true },
});

module.exports = mongoose.model("Face", FaceSchema);
