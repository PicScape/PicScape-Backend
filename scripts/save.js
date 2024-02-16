const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const saveName = process.argv[2];

if (!saveName) {
  console.error('Please provide a name for saving.');
  process.exit(1);
}

const uploadsPath = path.join(__dirname, '../uploads');
const userDataPath = path.join(__dirname, '../users.json');
const databasePath = path.join(__dirname, '../database.json');
const dummyDataFolder = path.join(__dirname, '../DummyData');
const saveFolder = path.join(dummyDataFolder, saveName);

try {
  if (!fs.existsSync(dummyDataFolder)) {
    fs.mkdirSync(dummyDataFolder);
  }

  if (fs.existsSync(saveFolder)) {
    deleteFolderRecursive(saveFolder);
  }

  fs.mkdirSync(saveFolder);

  try {
    execSync(`cp -r ${uploadsPath} ${saveFolder}`);
  } catch (err) {
    console.error(`Error copying uploads folder: ${err.message}`);
  }

  try {
    fs.copyFileSync(userDataPath, path.join(saveFolder, 'users.json'));
  } catch (err) {
    console.error(`Error copying users.json: ${err.message}`);
  }

  try {
    fs.copyFileSync(databasePath, path.join(saveFolder, 'database.json'));
  } catch (err) {
    console.error(`Error copying database.json: ${err.message}`);
  }

  console.log(`Saved data as '${saveName}' in DummyData folder.`);
} catch (err) {
  console.error('Error saving data:', err);
}

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(file => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else { 
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}
