const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.body)
        cb(null, "uploads/"); // Ensure the 'uploads' folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
    { name: "image", maxCount: 1 }, 
    { name: "symbol", maxCount: 1 }
]);

module.exports = upload;
