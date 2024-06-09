const express = require('express');
const router = express.Router();
const Pfp = require('../models/Pfp');
const Wallpaper = require('../models/Wallpaper');

const findUploadById = async (imgId) => {
  let upload = await Pfp.findOne({ imgId: imgId });
  if (!upload) {
    upload = await Wallpaper.findOne({ imgId: imgId });
  }
  return upload;
};

// Route to fetch upload information by upload ID
router.get('/data/:imgId', async (req, res) => {
  const { imgId } = req.params;

  try {
    const upload = await findUploadById(imgId);
    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    const response = {
      id: upload._id,
      title: upload.title,
      type: upload.type,
      imgId: imgId,
      author: upload.account,
      createdAt: upload.createdAt,
      //image: upload.image
    };

    res.json({ upload: response });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid upload ID format' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch the image by upload ID
router.get('/view/:imgId', async (req, res) => {
  const { imgId } = req.params;

  try {
    const upload = await findUploadById(imgId);
    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(upload.image);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid upload ID format' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
