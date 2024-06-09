const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for authentication
const auth = require('../middleware/auth');

// Mongoose Account model
const Account = require('../models/Account');

// GET /account - Route to fetch user information based on the token
router.get('/account', auth, (req, res) => {
  const token = req.headers['authorization'];

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'Failed to authenticate token' });
    } else {
        try {
            // Search for account in the Account model by username
            const account = await Account.findOne({_id: decoded.id});
        
            if (!account) {
              return res.status(404).json({ error: 'Account not found' });
            }
        
            const user = {
              id: account._id,
              username: account.username,
              email: account.email,
              roles: account.roles,
              created_at: account.created_at
            };
        
            res.json({ user });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
      
    }
  });
});

// GET /account - Route to fetch user information by username or userId from MongoDB
router.get('/user', async (req, res) => {
  const { username, userId } = req.query;

  try {
    let query;
    if (username) {
      query = { username };
    } else if (userId) {
      query = { _id: userId };
    } else {
      return res.status(400).json({ error: 'Please provide either username or userId' });
    }

    // Search for account in the Account model based on the provided query
    const account = await Account.findOne(query);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const user = {
      id: account._id,
      username: account.username,
      roles: account.roles,
      created_at: account.created_at
    };

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
