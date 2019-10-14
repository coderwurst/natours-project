const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.param('id', userController.checkId);

// authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
// protect to place user on request object
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

// updates
router.patch('/updateUser', authController.protect, userController.updateUser);

module.exports = router;
