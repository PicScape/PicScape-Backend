const fs = require('fs');
const jwt = require('jsonwebtoken');

const usersFile = "users.json";
const secretKey = 'key_test';

// Load users from JSON file
function loadUsers() {
  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } else {
    return [];
  }
}

// Save users to JSON file
function saveUsers(users) {
  const data = JSON.stringify(users, null, 2);
  fs.writeFileSync(usersFile, data, 'utf8');
}

// Function to find user by authentication token (JWT token)
function findUserByAuthToken(token) {
  try {
    // Decode the token to get user information
    const decoded = jwt.verify(token, secretKey);
    
    // Load users from JSON file
    const users = loadUsers();
    
    // Find user by username in the list of users
    const user = users.find(u => u.username === decoded.username);
    
    // Return the user object if found
    return user;
  } catch (err) {
    // Return null if token is invalid or user not found
    return null;
  }
}

module.exports = { loadUsers, saveUsers, findUserByAuthToken };
