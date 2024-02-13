const express = require('express');
const multer = require('multer');
const { loadUsers, saveUsers } = require('../utils');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const upload = multer();

router.post('/api/register', upload.none(), (req, res) => {
  const { username, password } = req.body;

  const user = {
    uuid: uuidv4(), 
    username,
    password 
  };

  let users = loadUsers(); 
  users.push(user); 

  saveUsers(users);

  res.status(201).send('User registered successfully');
});

module.exports = router;
