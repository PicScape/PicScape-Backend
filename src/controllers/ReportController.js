const jwt = require('jsonwebtoken');
const Report = require('../models/Report');
const Pfp = require('../models/Pfp');
const Wallpaper = require('../models/Wallpaper');
const Account = require('../models/Account');
const { JWT_SECRET } = process.env;

const findUploadById = async (imgId) => {
    let upload = await Pfp.findOne({ imgId: imgId });
    if (!upload) {
        upload = await Wallpaper.findOne({ imgId: imgId });
    }
    return upload;
};

const userReport = async (req, res) => {
    try {
      const token = req.headers['authorization'];
      const { imgId } = req.params;
  
      if (!token) {
        return res.status(401).json({ error: 'JWT token is missing' });
      }
      if (!imgId) {
        return res.status(400).json({ error: 'imgId is missing' });
      }
  
      jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.error('Failed to authenticate token:', err);
          return res.status(401).json({ error: 'Failed to authenticate token' });
        }
  
        try {
          const { title, description } = req.body;
  
          if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
          }
          if (typeof title !== 'string' || typeof description !== 'string') {
            return res.status(400).json({ error: 'Title and description must be strings' });
          }
          if (title.length < 3 || title.length > 100) {
            return res.status(400).json({ error: 'Title must be between 3 and 100 characters' });
          }
          if (description.length < 10) {
            return res.status(400).json({ error: 'Description must be at least 10 characters' });
          }
  
          const reporter = await Account.findById(decoded.id);
          if (!reporter) {
            return res.status(404).json({ error: 'Reporter account not found' });
          }
  
          const upload = await findUploadById(imgId);
          if (!upload) {
            return res.status(404).json({ error: 'Upload not found' });
          }
  
          const relatedAccount = upload.account;
  
          const newReport = new Report({
            title,
            description,
            imgId,
            reporter: reporter._id,
            relatedAccount: relatedAccount,
          });
  
          await newReport.save();
  
          console.log(`Report created successfully by user ${decoded.id}`);
          res.status(201).json({ message: 'Report created successfully', report: newReport });
        } catch (error) {
          console.error('Error creating report:', error);
          if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message, details: error.errors });
          }
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    } catch (error) {
      console.error('Error in userReport function:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = { userReport };
  


