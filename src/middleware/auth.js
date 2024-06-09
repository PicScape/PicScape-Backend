const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../models/Account'); // Import the User model

function auth(req, res, next) {
  // Get token from request header, query parameter, or body
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    } else {
      // Token is valid, check if user exists
      try {
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(401).json({ error: 'User associated with token does not exist' });
        }
        // User exists, attach the decoded information to the request object
        req.user = decoded;
        next();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  });
}

module.exports = auth;
