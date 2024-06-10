const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: '5MB' } });
const uploadController = require('../controllers/uploadController');


router.post('/pfp', auth, upload.single('image'), uploadController.uploadPfp);
router.post('/wallpaper', auth, upload.single('image'), uploadController.uploadWallpaper);

module.exports = router;
