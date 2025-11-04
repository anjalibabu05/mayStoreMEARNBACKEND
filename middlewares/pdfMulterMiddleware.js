const multer = require('multer');
const fs = require('fs');

// Ensure upload folder exists
const uploadDir = './pdfUploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `pdf-${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed!'), false);
};

const pdfmulterConfig = multer({ storage, fileFilter });

module.exports = pdfmulterConfig;
