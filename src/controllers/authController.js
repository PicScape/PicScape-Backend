const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const { SECRET } = process.env;


const authController = {
  async register(req, res) {
    try {
      
      const { username, password } = req.body;
      const newUser = new User({ username, password });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Registration failed' });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
      const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

    async getUserDataFromToken(req, res) {
      try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract the token from the "Bearer <token>" format
        const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        // Decode the token
        const decodedToken = jwt.decode(token, { complete: true });

        // Check if decoding was successful
        if (!decodedToken) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        // Extract and return all the data from the token
        res.json({ decodedToken });
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    }
  

};

module.exports = authController;
