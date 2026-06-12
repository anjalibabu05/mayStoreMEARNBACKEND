const express = require('express');
const { registerController, loginController, googleLoginController, getAlluserController } = require('./controllers/userController');
const bookController = require('./controllers/bookController');
const jobController = require('./controllers/jobController');
const userController = require('./controllers/userController');
const jwtMiddleware = require('./middlewares/jwtMiddleware');
const multerConfig = require('./middlewares/multerMiddleware');
const jwtAdminMiddleware = require('./middlewares/jwtAdminMiddleware');
const appController = require('./controllers/appController');
const pdfmulterConfig = require('./middlewares/pdfMulterMiddleware');

const router = express.Router();

// User Auth
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/google-login', googleLoginController);

// Public books
router.get('/all-home-books', bookController.getHomeBookController);

// User Routes
router.post(
  '/add-book',
  jwtMiddleware,
  multerConfig.array('uploadimages', 3),
  bookController.addBookController
);

router.get('/all-books', jwtMiddleware, bookController.getAllBookController);
router.get('/view-book/:id', bookController.getABookController);
router.get('/all-jobs', jobController.getAllJobController);

// Job Application
router.post(
  '/apply-job',
  jwtMiddleware,
  (req, res, next) => {
    pdfmulterConfig.single('resume')(req, res, function (err) {
      if (err) {
        console.error('❌ Multer Error:', err.message);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  appController.addApplicationController
);

// User profile & books
router.patch(
  '/user-edit-profile',
  jwtMiddleware,
  multerConfig.single('profile'),
  userController.editUserProfileController
);

router.get('/user-tab-books', jwtMiddleware, bookController.getAllUserBookController);
router.get('/user-brought-books', jwtMiddleware, bookController.getAllUserBroughtBookController);

// Admin Routes
router.get('/admin-all-books', jwtAdminMiddleware, bookController.getAllBookAdminController);
router.put('/approve-books', jwtAdminMiddleware, bookController.approveBookController);
router.get('/all-users', jwtAdminMiddleware, getAlluserController);
router.post('/add-job', jobController.addJobController);
router.delete('/delete-job/:id', jobController.deleteAJobController);
router.get('/all-application', appController.getAllApplicationController);
router.put('/admin-profile-update', jwtAdminMiddleware, multerConfig.single('profile'), userController.editAdminProfileController);

// Payment
router.put('/make-payment', jwtMiddleware, bookController.makePaymentController);

module.exports = router;
