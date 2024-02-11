const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp'); 
const utils = require('../utils');
const fs = require('fs').promises; 

const router = express.Router();
const imagesFolder = "uploads";
const tempFolder = "temp";



const generateUniqueID = async () => {
  let id;
  do {
    id = Math.floor(10000 + Math.random() * 90000);
    const database = utils.loadDatabase();
    const idExists = database.images.some(image => image.id === id);
    if (!idExists) {
        console.log("id " + id + "does not exist")
        return id;
      
    }
  } while (true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(imagesFolder, tempFolder)); 
  },
  filename: async (req, file, cb) => {
    const id = await generateUniqueID();
    const filename = `${id}${path.extname(file.originalname)}`;
    cb(null, filename);
    req.generatedId = id;
  },
});

const upload = multer({ storage });

router.post('/api/upload', upload.single('file'), async (req, res) => { 
  const { title, description, tags } = req.body;
  const id = req.generatedId;

  const tempFilePath = path.join(imagesFolder, tempFolder, `${id}${path.extname(req.file.originalname)}`);
  const finalFilePath = path.join(imagesFolder, `${id}.png`);

  await fs.rename(req.file.path, tempFilePath);

  await sharp(tempFilePath).toFormat('png').toFile(finalFilePath);

  await fs.unlink(tempFilePath);

  const database = utils.loadDatabase();
  const filename = `${id}.png`; 
  const date = utils.getCurrentFormattedDate();

  database.images.push({ id, title, tags, description, filename, date });
  utils.saveDatabase(database);

  res.json({ message: 'Upload successful' });
});

module.exports = router;
