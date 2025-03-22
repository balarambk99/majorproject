const Candidate = require("../models/candidate");


// const createCandidate = async (req, res) => {
//     try {
//         const { fullName, age, party, bio } = req.body;
//         const image = req.files["image"] ? req.files["image"][0].path : null;
//         const symbol = req.files["symbol"] ? req.files["symbol"][0].path : null;

//         if (!fullName || !age || !party || !bio || !image || !symbol) {
//             return res.status(400).json({ success: false, message: "All fields are required." });
//         }

//         const newCandidate = new Candidate({ fullName, age, party, bio, image, symbol, votes: 0 });
//         await newCandidate.save();

//         res.status(201).json({ success: true, message: "Candidate created successfully!", candidate: newCandidate });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server error." });
//     }
// };


//const Candidate = require("../models/Candidate");

const createCandidate = async (req, res) => {
    try {

        console.log("wellcome to mypalce");
        //console.log(req.body)
        //console.log("Files received:", req.files); // Debugging logs

        // Extract form data
        //console.log(req.body);
        //console.log("Files received:", req.files);
        
        // Extract form data
        const { 
            fullName, age, party, 
            state, city, constituency, voterId, bio,  
            image, symbol 
        } = req.body;
        
        // Validate required fields
        if (!fullName || !age || !party || !state || !city || !constituency || !voterId || !bio  || !image || !symbol) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        
        // Validate age (must be a number and >= 18)
        const parsedAge = parseInt(age);
        if (isNaN(parsedAge) || parsedAge < 18) {
            console.log("Failed: Invalid age");
            return res.status(400).json({ success: false, message: "Invalid age. Must be a number and at least 18." });
        }
        
        // Create and save candidate
        const newCandidate = new Candidate({
            fullName,
            age: parsedAge, // Ensure it's stored as a number
            party,
           
          
         
            state,
            city,
            constituency,
            voterId,
            bio,
           
            image,
            symbol,
            votes: 0
        });
        console.log("sucessf")
        await newCandidate.save();
        console.log("Success: Candidate created");
        return res.status(201).json({
            success: true,
            message: "Candidate created successfully!",
            candidate: newCandidate
        });
        

    } catch (error) {
        console.error("Error in createCandidate:", error);
        return res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};



const getAllCandidates = async (req, res) => {
    try {
        console.log("wellocome to all canadaite")
        const candidate = await Candidate.find({});
        console.log("cnadiad")
       // console.log(candidate);
        res.status(200).json({ success: true, candidate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.find({});
       // console.log(candidate)
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });
          console.log("error");
        res.status(200).json({ success: true, candidate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


const deleteCandidate = async (req, res) => {
    try {
        console.log("dlelte cadiare");
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

        res.status(200).json({ success: true, message: "Candidate deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports = { createCandidate, getAllCandidates, getCandidateById, deleteCandidate };
