const fs = require('fs');
const path = require('path');

const uploadsFolder = "uploads";
const tempFolder = path.join(uploadsFolder, "temp");

function createImagesFolder() {
  // Create the uploads folder if it doesn't exist
  if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
    console.log(`Folder "${uploadsFolder}" was missing, successfully created one`);
  }

  // Create the temp folder inside uploads if it doesn't exist
  if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder);
    console.log(`Folder "${tempFolder}" was missing, successfully created one inside "${uploadsFolder}"`);
  }
}

module.exports = { createImagesFolder };
