const Voter = require("../models/voter");

// ✅ Get All Voters
const getAllVoters = async (req, res) => {
    try {
        const voters = await Voter.find(); // Fetch all voters from DB
        res.status(200).json({ success: true, voters }); // Send response
    } catch (error) {
        console.error("Error fetching voters:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

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

module.exports = { getAllVoters,deleteVoter };
