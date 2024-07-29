const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');


router.post('/:imgId', ReportController.userReport);


module.exports = router;
