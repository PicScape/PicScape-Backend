const express = require('express');
const router = express.Router();
const Pfp = require('../models/Pfp');
const Wallpaper = require('../models/Wallpaper');

// GET /uploads/data/:id - Route to fetch upload information by upload ID
router.get('/data/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the upload by ID in the Pfp collection
    let upload = await Pfp.findById(id).lean();

    // If upload is not found in the Pfp collection, try finding it in the Wallpaper collection
    if (!upload) {
      upload = await Wallpaper.findById(id).lean();
      if (!upload) {
        return res.status(404).json({ error: 'Upload not found' });
      }
    }

    // Construct the response object
    const response = {
      id: upload._id,
      title: upload.title,
      author: upload.account,
      createdAt: upload.createdAt,
      image: upload.image
    };

    res.json({ upload: response });
  } catch (error) {
    // Filter out CastErrors for the "id" field
    if (error.name === 'CastError' && error.path === '_id') {
      return res.status(400).json({ error: 'Invalid upload ID format' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /uploads/view/:id - Route to fetch the image by upload ID
router.get('/view/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the upload by ID
    const upload = await Pfp.findById(id);

    // If upload is not found, return 404 error
    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    // Set response headers
    res.set('Content-Type', 'image/jpeg'); // Adjust content type based on image format

    // Send the image data in the response
    res.send(upload.image);

  } catch (error) {

    // Check if the error is a CastError (invalid ID format)
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid upload ID format' });
    }

    // For other errors, return a 500 Internal Server Error
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
