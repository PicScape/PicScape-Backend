const fs = require('fs');
const path = require('path');

const loadName = process.argv[2];

if (!loadName) {
  console.error('Please provide a name for loading.');
  process.exit(1);
}

const dummyDataFolder = path.join(__dirname, '../DummyData');
const loadFolder = path.join(dummyDataFolder, loadName);

if (!fs.existsSync(loadFolder)) {
  console.error(`No data found with name '${loadName}' in DummyData folder.`);
  process.exit(1);
}

const rootUploadsPath = path.join(__dirname, '../uploads');
const rootUserDataPath = path.join(__dirname, '../users.json');
const rootDatabasePath = path.join(__dirname, '../database.json');

try {
  if (fs.existsSync(rootUploadsPath)) {
    deleteFolderRecursive(rootUploadsPath);
  }

  if (fs.existsSync(rootUserDataPath)) {
    fs.unlinkSync(rootUserDataPath);
  }

  if (fs.existsSync(rootDatabasePath)) {
    fs.unlinkSync(rootDatabasePath);
  }

  fs.mkdirSync(rootUploadsPath);

  const loadFolderUploadsPath = path.join(loadFolder, 'uploads');
  if (fs.existsSync(loadFolderUploadsPath)) {
    fs.readdirSync(loadFolderUploadsPath).forEach(file => {
      const srcFilePath = path.join(loadFolderUploadsPath, file);
      const destFilePath = path.join(rootUploadsPath, file);
      const isDirectory = fs.statSync(srcFilePath).isDirectory();
      if (!isDirectory) {
        try {
          fs.copyFileSync(srcFilePath, destFilePath);
        } catch (err) {
          console.error(`Error copying file '${file}':`);
        }
      }
    });
  }

  try {
    fs.copyFileSync(path.join(loadFolder, 'users.json'), rootUserDataPath);
  } catch (err) {
    console.error('Error copying users.json:');
  }

  try {
    fs.copyFileSync(path.join(loadFolder, 'database.json'), rootDatabasePath);
  } catch (err) {
    console.error('Error copying database.json:');
  }

  console.log(`Loaded data '${loadName}' from DummyData folder.`);
} catch (err) {
  console.error('Error loading data:');
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
