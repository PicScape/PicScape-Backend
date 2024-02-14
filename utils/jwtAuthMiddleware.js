const jwt = require('jsonwebtoken');
const fs = require('fs');
const { loadUsers } = require('../utils');

const secretKey = 'test_key';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  const users = loadUsers();


  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    const userExists = users.some(u => u.username === decoded.username);
    if (!userExists) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });

  }
};

module.exports = verifyToken;
