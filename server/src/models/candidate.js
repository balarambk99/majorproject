const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema(
    {
        fullName: { 
            type: String, 
            required: [true, "Candidate name is required"],
            trim: true
        },
        age: { 
            type: Number, 
            required: [true, "Age is required"], 
            min: [18, "Candidate must be at least 18 years old"]
        },
        party: { 
            type: String, 
            required: [true, "Party name is required"], 
            trim: true
        },
        bio: { 
            type: String, 
            required: [true, "Bio is required"], 
            maxlength: [500, "Bio cannot exceed 500 characters"]
        },
        image: { 
            type: String, 
            required: [true, "Candidate image is required"] 
        }, 
        symbol: { 
            type: String, 
            required: [true, "Party symbol is required"] 
        },  votes: { 
            type: Number, 
            default: 0, 
            min: 0 
        } 
    }, 
    { timestamps: true }
);

const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;
