const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Store uploaded file in memory
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

  // Check if file is present
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Convert image to JPEG format
    const convertedBuffer = await convertToJPEG(file.buffer);

    // Create a new profile picture upload entry
    const pfp = new Pfp({
      title: 'pfp',
      image: convertedBuffer,
      account: req.user.id
    });

    await pfp.save();

    res.json({ message: 'Profile picture upload successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /upload/wallpaper - Route to upload a wallpaper
router.post('/wallpaper', auth, upload.single('image'), async (req, res) => {
  const { file } = req;

  // Check if file is present
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Convert image to JPEG format
    const convertedBuffer = await convertToJPEG(file.buffer);

    // Create a new wallpaper upload entry
    const wallpaper = new Wallpaper({
      title: 'wallpaper',
      image: convertedBuffer,
      account: req.user.id
    });

    await wallpaper.save();

    res.json({ message: 'Wallpaper upload successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
