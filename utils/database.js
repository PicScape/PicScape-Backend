const fs = require('fs');
const databaseFile = "database.json";

function loadDatabase() {
  if (fs.existsSync(databaseFile)) {
    const data = fs.readFileSync(databaseFile, 'utf8');
    return JSON.parse(data);
  } else {
    return { images: [] };
  }
}

function saveDatabase(database) {
  const data = JSON.stringify(database, null, 2);
  fs.writeFileSync(databaseFile, data, 'utf8');
}

module.exports = { loadDatabase, saveDatabase };
