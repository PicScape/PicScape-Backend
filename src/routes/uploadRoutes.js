const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: '5MB' } // 5 MB limit
});
const sharp = require('sharp');

// Models
const Pfp = require('../models/Pfp');
const Wallpaper = require('../models/Wallpaper');

// Function to convert image buffer to JPEG format using Sharp
const convertToJPEG = async (buffer) => {
  return sharp(buffer).jpeg().toBuffer();
};

// POST /upload/pfp - Route to upload a profile picture
router.post('/pfp', auth, upload.single('image'), async (req, res) => {
  const { file } = req;
  const { tags, title } = req.body;

  // Check if file is present
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Check if file size exceeds limit
  if (file.size > 5 * 1024 * 1024) { // 5 MB limit
    return res.status(400).json({ error: 'File size exceeds maximum limit (5MB)' });
  }

  // Check if tags are present and valid
  if (!Array.isArray(tags) || tags.length < 2) {
    return res.status(400).json({ error: 'A minimum of 2 tags is required' });
  }

  try {
    // Convert image to JPEG format
    const convertedBuffer = await convertToJPEG(file.buffer);

    // Create a new profile picture upload entry
    const pfp = new Pfp({
      title: title,
      type: 'pfp',
      image: convertedBuffer,
      account: req.user.id,
      tags: tags
    });

    await pfp.save();

    res.json({ message: 'Profile picture upload successful' });
  } catch (error) {
    // Check if error is due to dimension mismatch
    if (error.message === 'Image dimensions must be 1:1') {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /upload/wallpaper - Route to upload a wallpaper
router.post('/wallpaper', auth, upload.single('image'), async (req, res) => {
  const { file } = req;
  const { tags } = req.body;

  // Check if file is present
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Check if file size exceeds limit
  if (file.size > 5 * 1024 * 1024) { // 5 MB limit
    return res.status(400).json({ error: 'File size exceeds maximum limit (5MB)' });
  }

  // Check if tags are present and valid
  if (!Array.isArray(tags) || tags.length < 2) {
    return res.status(400).json({ error: 'A minimum of 2 tags is required' });
  }

  try {
    // Convert image to JPEG format
    const convertedBuffer = await convertToJPEG(file.buffer);

    // Create a new wallpaper upload entry
    const wallpaper = new Wallpaper({
      title: title,
      type: 'wallpaper',
      image: convertedBuffer,
      account: req.user.id,
      tags: tags
    });

    await wallpaper.save();

    res.json({ message: 'Wallpaper upload successful' });
  } catch (error) {
    // Check if error is due to dimension mismatch
    if (error.message === 'Image dimensions must be 1:1') {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
