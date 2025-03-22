const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken =async (req, res, next) => {

    //console.log(req.body);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log("wellocome to auth")
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    //console.log('Full URL:', fullUrl);

    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("ve")
            return res.status(403).json({ message: "Invalid or Expired Token" });
        }
        req.user = user;
        console.log("sucessfull autherisation");
        next();
    });
};

module.exports = authenticateToken;
