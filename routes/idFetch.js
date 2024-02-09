const express = require('express');
const { loadDatabase } = require('../utils');
const path = require('path');


const router = express.Router();

router.get('/api/images/:id', (req, res) => {
  const { id } = req.params;
  const database = loadDatabase();
  
  const image = database.images.find(img => parseInt(img.id) === parseInt(id));

  if (!image) {
    res.status(404).json({ message: 'Image not found' });
    return;
  }

  const imagePath = path.join(__dirname, '../uploads', image.filename);
  res.sendFile(imagePath);
});

module.exports = router;
