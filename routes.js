const express = require('express');
const { registerController, loginController, googleLoginController, getAlluserController } = require('./controllers/userController');
const bookController = require('./controllers/bookController');
const jobController=require('./controllers/jobController')
const userController=require('./controllers/userController')
const jwtMiddleware = require('./middlewares/jwtMiddleware');
const multerConfig = require('./middlewares/multerMiddleware');
const jwtAdminMiddleware = require('./middlewares/jwtAdminMiddleware');
const appController=require('./controllers/appController');
const pdfmulterConfig=require('./middlewares/pdfMulterMiddleware')

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
router.get('/all-jobs',jobController.getAllJobController)

// path to add Application
router.post(
  '/apply-job',
  jwtMiddleware,
  (req, res, next) => {
    pdfmulterConfig.single('resume')(req, res, function(err) {
      if (err) {
        console.error("❌ Multer Error:", err.message);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  appController.addApplicationController
);

// path to get all user books
// router.get('/user-books', jwtMiddleware, bookController.getAllUserBookController);

// path to get all 
// router.get('/user-brought-books', jwtMiddleware, bookController.getAllUserBroughtBookController);

// path to update userProfile
router.patch(
  "/user-edit-profile",
  jwtMiddleware, // ✅ FIXED: user route uses jwtMiddleware, not admin
  multerConfig.single("profile"),
  userController.editUserProfileController
);

// path to get all user book to profile tab page

router.get(
  "/user-tab-books",
  jwtMiddleware, // ✅ FIXED: user route uses jwtMiddleware, not admin
  bookController.getAllUserBookController
);

// path to get brought book
router.get(
  "/user-brought-books",
  jwtMiddleware, // ✅ FIXED: user route uses jwtMiddleware, not admin
  bookController.getAllUserBroughtBookController
);


// Admin Routes
router.get('/admin-all-Books', jwtAdminMiddleware, bookController.getAllBookAdminController);
router.put('/approve-Books', jwtAdminMiddleware, bookController.approveBookController);
router.get('/all-users', jwtAdminMiddleware, getAlluserController);


// path to add new job

router.post('/add-job',jobController.addJobController)


// path to delete a job

 router.get('/delete-job/:id',jobController.deleteAJobController)

//  path to get all Applicatins
router.get('/all-application',appController.getAllApplicationController)

// path to update admin profile
router.put('/admin-profile-update',jwtAdminMiddleware,multerConfig.single('profile'),userController.editAdminProfileController)

// path to make payment
router.put('/make-payment',jwtAdminMiddleware,multerConfig.single('profile'),bookController.makePaymentController)



module.exports = router;
