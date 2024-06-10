const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/ImageController');


router.get('/data/:imgId', ImageController.getUploadData);
router.get('/view/:imgId', ImageController.viewUpload);

module.exports = router;
