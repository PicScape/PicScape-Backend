const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.get('/activate', accountController.activateAccount);
router.post('/verify', accountController.verifyLoginCode);
router.put('/edit', accountController.editCredentials);


module.exports = router;
