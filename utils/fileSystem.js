const fs = require('fs');

const imagesFolder = "uploads";

function createImagesFolder() {
  if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder);
    console.log(`Folder "${imagesFolder}" was missing, successfully created one`);
  }
}

module.exports = { createImagesFolder };
