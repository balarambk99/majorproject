const Voter = require("../models/voter"); // Assuming voters are stored in this model
const Candidate = require("../models/candidate"); // Assuming candidates are stored in this model
//const Vote = require("../models/vote"); // Assuming votes are stored in this model

const getDashboardData = async (req, res) => {
    try {
        console.log("Fetching dashboard data...");

      
        const voterCount = await Voter.countDocuments();

       
        const candidateCount = await Candidate.countDocuments();

        // c
        // console.log(vote);
        const votersVoted = await Voter.countDocuments({ voteStatus: "Voted" });

        // Logging for debugging
        console.log("Total Voters:", voterCount);
        console.log("Total Candidates:", candidateCount);
        console.log("Total Voted:", votersVoted);
        console.log("Dashboard Data:", { voterCount, candidateCount, votersVoted });
        console.log("Dashboard data fetched successfully!\n\n");

        // Sending response
        res.json({
            success: true,
            DashboardData: {
                voterCount,
                candidateCount,
                votersVoted,
            },
        });

   

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getDashboardData };
