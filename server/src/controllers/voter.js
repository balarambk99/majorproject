const Candidate = require("../models/candidate");
const Voter = require("../models/voter");
const Vote = require("../models/vote");

// ✅ Get a single voter by ID
const getVoter = async (req, res) => {
    try {
        console.log("Fetching voter...");

        const voterId = req.params.id
        console.log("Voter ID:", voterId);

        // Find voter but exclude the image and password fields
        const voter = await Voter.findOne({ voterid: voterId }, "-password");

        if (!voter) {
            return res.status(404).json({ message: "Voter not found" });
        }

        console.log("Voter found:", voter);
        res.json({ voter });
    } catch (error) {
        console.error("Error fetching voter:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get all voters
const getAllVoters = async (req, res) => {
    try {
        console.log("Fetching all voters...");

        // Exclude password and image fields
        const voters = await Voter.find({}, "-password -image");

        if (!voters || voters.length === 0) {
            return res.status(404).json({ message: "No voters found" });
        }

        console.log("Voters retrieved successfully.");
        res.json({ voters });
    } catch (error) {
        console.error("Error fetching voters:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Delete a voter by ID
const deleteVoter = async (req, res) => {
    try {
        console.log("Attempting to delete voter...");

        const { id } = req.params; // Extract voter ID
        console.log("Voter ID:", id);

        // Check if voter exists
        const voter = await Voter.findOne({ voterid: id });
        if (!voter) {
            return res.status(404).json({ message: "Voter not found" });
        }

        // Delete the voter
        await Voter.deleteOne({ voterid: id });
        console.log("Voter deleted successfully.");

        res.json({ success: true, message: "Voter deleted successfully" });
    } catch (error) {
        console.error("Error deleting voter:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Cast a vote
const giveVote = async (req, res) => {
    try {
        console.log("Processing vote...");
         console.log(req.body);
        const { voterid, candidatename, party } = req.body;

        // Validate input
        if (!voterid || !candidatename || !party) {
            return res.status(400).json({ message: "Voter ID, Candidate ID, and Party are required" });
        }

        // Check if voter exists
        const voterExists = await Voter.findOne({ voterid: voterid });
        if (!voterExists) {
            return res.status(404).json({ message: "Voter not found" });
        }

        // Check if the voter has already voted
        const existingVote = await Vote.findOne({ voterid });
        if (existingVote) {
            return res.status(400).json({ message: "Voter has already cast a vote" });
        }

        // Store the vote in the database
        const newVote = await Vote.create({ voterid, candidatename, party });
        const voterUpdate = await Voter.updateOne(
            { voterid: voterid, voteStatus: "Not Voted" }, // Ensure voter has not already voted
            { $set: { voteStatus: "Voted" } }
        );
        const candidateUpdate = await Candidate.updateOne(
            { fullName: candidatename },
            { $inc: { votes: 1 } } // Increment vote count by 1
        );
        console.log("Vote successfully cast.");
        res.status(201).json({ success: true, message: "Vote cast successfully", vote: newVote });
    } catch (error) {
        console.error("Error casting vote:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getVoter, deleteVoter, getAllVoters, giveVote };
