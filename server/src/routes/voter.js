const express = require("express");
const router = express.Router();
const { getVoter, deleteVoter, giveVote } = require("../controllers/voter");
const authenticateToken = require("../middlewars/authMiddleware");


router.get("/getVoter/:id", authenticateToken, getVoter);
router.get("/getAllVoter",authenticateToken,)
router.delete("/deleteVoter",authenticateToken,deleteVoter);
router.post("/giveVote",authenticateToken,giveVote)
module.exports = router;
