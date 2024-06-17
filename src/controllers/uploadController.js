const Pfp = require('../models/Pfp');
const Wallpaper = require('../models/Wallpaper');
const sharp = require('sharp');

const convertToJPEG = async (buffer) => {
  return sharp(buffer).jpeg().toBuffer();
};

const uploadPfp = async (req, res) => {
  const { file } = req;
  const { tags, title, description } = req.body;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size exceeds maximum limit (5MB)' });
  }

  if (!Array.isArray(tags) || tags.length < 2) {
    return res.status(400).json({ error: 'A minimum of 2 tags is required' });
  }

  if (!title) {
    return res.status(400).json({ error: 'Missing required title' });
  }
  if (!description) {
    return res.status(400).json({ error: 'Missing required description' });
  }
  

  try {
    const convertedBuffer = await convertToJPEG(file.buffer);

    const pfp = new Pfp({
      title: title,
      description: description,
      type: "pfp",
      image: convertedBuffer,
      account: req.user.id,
      tags: tags,
    });

    await pfp.save();

    res.json({ message: 'Profile picture upload successful' });
  } catch (error) {
    if (error.message === 'Image dimensions must be 1:1') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const uploadWallpaper = async (req, res) => {
  const { file } = req;
  const { tags, title, description } = req.body;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (file.size > 50 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size exceeds maximum limit (5MB)' });
  }

  if (!Array.isArray(tags) || tags.length < 2) {
    return res.status(400).json({ error: 'A minimum of 2 tags is required' });
  }

  if (!title) {
    return res.status(400).json({ error: 'Missing required title' });
  }
  if (!description) {
    return res.status(400).json({ error: 'Missing required description' });
  }
  

  try {
    const convertedBuffer = await convertToJPEG(file.buffer);

    const wallpaper = new Wallpaper({
      title: title,
      description: description,
      type: "wallpaper",
      image: convertedBuffer,
      account: req.user.id,
      tags: tags,
    });

    await wallpaper.save();

    res.json({ message: 'Wallpaper upload successful' });
  } catch (error) {
    if (error.message === 'Image dimensions must be 1:1') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { uploadPfp, uploadWallpaper };
