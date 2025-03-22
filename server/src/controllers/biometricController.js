const Biometric = require("../models/Biometric");
const {generateRegistrationOptions}=require("@simplewebauthn/server");
const User = require("../models/voter");

exports.registerBiometric =  async (req, res) => {
  try {
    const { voterid } = req.body;
    
    if (!voterid) {
      return res.status(400).json({ error: "Voter ID is required" });
    }

    const userBio = await User.findOne({ voterid });
    
    if (!userBio) {
      return res.status(404).json({ error: "User not found" });
    }

    const challenge = await generateRegistrationOptions({
      rpID: "localhost",
      rpName: "Localhost",
      userName: userBio.name
    });

    if (challenge) {
      const data = new Biometric({ voterid, finger: challenge });
      await data.save();
      return res.json({ options: challenge });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.verifyBiometric = async (req, res) => {
  const { email, assertion } = req.body;
  const user = await Biometric.findOne({ email });

  if (user && user.credential.id === assertion.id) {
    return res.json({ success: true });
  }
  res.json({ success: false });
};
