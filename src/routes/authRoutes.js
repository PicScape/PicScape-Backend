const express = require('express');
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Route for user registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new account
    const newAccount = new Account({ username, email, password });

    // Save the account to the database
    await newAccount.save();

    res.status(201).send({ message: 'Account created successfully!' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the account by email
    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    // Compare the given password with the stored hash
    account.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(500).send({ error: 'Server error' });

      if (!isMatch) {
        return res.status(400).send({ error: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: account._id, username: account.username, email: account.email },
        JWT_SECRET,
        { expiresIn: '7d' } // Token expiration time
      );

      res.send({ message: 'Login successful!', token });
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
