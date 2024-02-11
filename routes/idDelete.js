const express = require('express');
const { loadDatabase, saveDatabase } = require('../utils');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/api/images/delete/:id', (req, res) => {
  const { id } = req.params;
  const database = loadDatabase();
  
  const imageIndex = database.images.findIndex(img => parseInt(img.id) === parseInt(id));

  if (imageIndex === -1) {
    res.status(404).json({ message: 'Image not found' });
    return;
  }

  const filename = database.images[imageIndex].filename;

  const imagePath = path.join(__dirname, '../uploads', filename);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error deleting image file:', err);
    } else {
      console.log('Image file deleted successfully:', filename);
    }
  });

  const deletedImage = database.images.splice(imageIndex, 1)[0];

  saveDatabase(database);

  res.json({ message: 'Image deleted', deletedImage });
});

module.exports = router;
