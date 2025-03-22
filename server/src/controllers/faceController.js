const Face = require("../models/Face");
const faceapi=require("face-api.js");
const User = require("../models/voter");
exports.registerFace =  async (req, res) => {
  try {
    console.log("we")
    const { voterid ,face} = req.body;
    const faceData = new Face({ voterid, face }); // Pass object
    await faceData.save(); // Await the save operation
    res.json({ success: true });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
function objectToArray(obj) {
  return Object.values(obj);
}

exports.verifyFace = async (req, res) => {

  try{

   // console.log(req.body);
    const {email,face}=req.body;
    console.log(email);
     const user =await User.findOne({email:email});

     console.log(user.voterid)
     if (!user) {
      console.log("jewll")
      return res.status(404).json({ error: "User not found" });
    }
   // console.log(face);

    
    const faceObject = await Face.findOne({ voterid: user.voterid });
    const faceArray =await objectToArray(face);
const storedFaceArray = await objectToArray(faceObject.face[0]);
  // console.log("New face embedding:", faceObject.face);


// console.log("New face embedding length:", storedFaceArray);
// console.log("Stored face embedding:", faceArray);
// console.log("Stored face embedding length:",faceArray.length);
// console.log("fg",storedFaceArray.length)
// console.log("\n\n");

    if (!faceObject) {
      return res.status(404).json({ error: "Face data not found" });
    }
    
    // Compute Euclidean distance
    const result = await faceapi.euclideanDistance(faceArray, storedFaceArray);
    
    // Lower distance = better match
    console.log(result)
    if (result < 0.6) {

      console.log("sucessfull")
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }

  }catch(e)
  {
    console.log(e);
  }
 
};
