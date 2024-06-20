const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../models/Account');



function auth(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    } else {
      try {
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(401).json({ error: 'User associated with token does not exist' });
        }
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
