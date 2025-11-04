const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, `image-${Date.now()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  if (['image/png','image/jpeg','image/jpg'].includes(file.mimetype)) cb(null, true);
  else cb(new Error('Accepts only png, jpg, jpeg files!'));
};

// ✅ Multer should use 'uploadimages' as field name
const multerConfig = multer({ storage, fileFilter });

module.exports = multerConfig;
