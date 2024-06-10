const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const accountController = require('../controllers/accountController');

router.get('/account', auth, accountController.getAccount);
router.get('/user', accountController.getUser);

module.exports = router;
