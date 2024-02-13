const fs = require('fs');
const usersFile = "users.json";

function loadUsers() {
  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } else {
    return [];
  }
}

function saveUsers(users) {
  const data = JSON.stringify(users, null, 2);
  fs.writeFileSync(usersFile, data, 'utf8');
}

module.exports = { loadUsers, saveUsers };
