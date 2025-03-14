  const router = require("express").Router();
const upload = require("../middlewars/addCandidateMiddleware"); // Make sure path is correct
const { createCandidate,getAllCandidates, deleteCandidate } = require("../controllers/admin");
const { getAllVoters} = require("../controllers/getVoterinfo");
const { route } = require("./voter");
const { getDashboardData } = require("../controllers/dashboar");
const { login } = require("../controllers/authController");
const { deleteVoter } = require("../controllers/voter");
const authenticateToken = require("../middlewars/authMiddleware");
const { adminLogin } = require("../controllers/adminLogin");

router.delete("/deleteVoter",authenticateToken,deleteVoter)
router.post("/createCandidate",authenticateToken, createCandidate);
router.get("/getCandidate",authenticateToken,getAllCandidates);
router.delete("/deleteCandidate",authenticateToken,deleteCandidate);
router.get("/getVoter",authenticateToken,getAllVoters);
router.get("/getDashboardData",authenticateToken,getDashboardData);

router.post("/login",adminLogin);
module.exports = router;
