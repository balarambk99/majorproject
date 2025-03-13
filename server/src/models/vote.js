const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    voterid: { type: String, required: true, unique: true }, // Ensure voter votes only once
    candidatename: { type: String, required: true },
    party: { type: String, required: true }, // Add party field
    timestamp: { type: Date, default: Date.now } // Store voting time
});

const Vote = mongoose.model("Vote", voteSchema);
module.exports = Vote;
