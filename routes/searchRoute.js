const express = require('express');
const { loadDatabase } = require('../utils');

const router = express.Router();

router.get('/api/search/:tags', (req, res) => {
  const { tags } = req.params;
  const database = loadDatabase();
  const searchTags = tags.toLowerCase().split(' ');

  const filteredImages = database.images.filter(img =>
    searchTags.every(searchTag => img.tags.includes(searchTag))
  );

  if (filteredImages.length === 0) {
    res.json({ message: 'No Images found' });
    return;
  }

  const result = filteredImages.map(img => ({ img }));
  res.json(result);
});

module.exports = router;
