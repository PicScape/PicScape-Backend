const fs = require('fs');
const jwt = require('jsonwebtoken');

const usersFile = "users.json";
const secretKey = 'key_test';

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

function findUserByAuthToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    
    const users = loadUsers();
    
    const user = users.find(u => u.username === decoded.username);
    
    return user;
  } catch (err) {
    return null;
  }
}

module.exports = { loadUsers, saveUsers, findUserByAuthToken };
