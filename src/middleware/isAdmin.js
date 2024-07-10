
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../models/Account');



  function isAdmin(req, res, next) {
    const token = req.headers['authorization'];
  
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Failed to authenticate token' });
      } else {
        try {
          const user = await User.findById(decoded.id);
          if (user && user.isAdmin) {
            next();
          } else {
            return res.status(403).json({ error: 'Access denied: Admins only' });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      }
    });
  }

  module.exports = isAdmin;
