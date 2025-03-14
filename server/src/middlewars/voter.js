const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
      },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, GIF, MP4, and PDF files are allowed!"), false);
    }
};


const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit: 10MB
});
module.exports=upload;