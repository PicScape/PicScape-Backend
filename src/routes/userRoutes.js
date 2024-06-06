const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const UserController = require('../controllers/userController');

// Profile route with token auth
router.get('/profile', authMiddleware, UserController.getProfile);
module.exports = router;
