const express = require('express');
const { loadDatabase, getCurrentFormattedDate } = require('../utils');

const router = express.Router();

router.get('/api/random', (req, res) => {
  const database = loadDatabase();
  const { count } = req.query;
  const numCount = parseInt(count, 10) || 1;

  const randomImages = [];
  const selectedIndices = new Set();

  while (randomImages.length < numCount && randomImages.length < database.images.length) {
    const randomIndex = Math.floor(Math.random() * database.images.length);

    if (selectedIndices.has(randomIndex)) {
      continue;
    }

    const randomImage = database.images[randomIndex];

    if (!randomImage) {
      break;
    }

    const result = { randomImage };
    randomImages.push(result);
    selectedIndices.add(randomIndex);
  }

  res.json(randomImages);
});

module.exports = router;
