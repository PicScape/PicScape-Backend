const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const Pfp = require('../models/Pfp');
const Wallpaper = require('../models/Wallpaper');

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Missing required username' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Missing required email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing required password' });
    }

    const existingAccount = await Account.findOne({ $or: [{ username }, { email }] });
    if (existingAccount) {
      return res.status(400).json({ error: 'Account with this username or email already exists' });
    }

    const newAccount = new Account({ username, email, password });
    await newAccount.save();
    res.status(201).send({ message: 'Account created successfully!' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ email });

    if (!password || !email || !account) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    account.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(500).send({ error: 'Server error' });
      if (!isMatch) return res.status(400).send({ error: 'Invalid email or password' });

      const token = jwt.sign(
        { id: account._id, username: account.username, email: account.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.send({ message: 'Login successful!', token });
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getAccount = async (req, res) => {
  const token = req.headers['authorization'];
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
    try {
      const account = await Account.findOne({ _id: decoded.id });
      if (!account) return res.status(404).json({ error: 'Account not found' });
      const user = {
        id: account._id,
        username: account.username,
        email: account.email,
        roles: account.roles,
        isAdmin: account.isAdmin,
        created_at: account.created_at
      };
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

const getUser = async (req, res) => {
  const { username, userId } = req.query;
  try {
    let query = username ? { username } : userId ? { _id: userId } : null;
    if (!query) return res.status(400).json({ error: 'Please provide either username or userId' });

    const account = await Account.findOne(query);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    const user = {
      id: account._id,
      username: account.username,
      roles: account.roles,
      created_at: account.created_at
    };
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const editCredentials = async (req, res) => {
  const token = req.headers['authorization'];
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Failed to authenticate token:', err);
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    try {
      const account = await Account.findById(decoded.id);
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      if (req.body.username) {
        const trimmedUsername = req.body.username.trim();
        if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
          return res.status(400).json({ error: 'Username must be between 3 and 50 characters' });
        }
        account.username = trimmedUsername;
      }

      if (req.body.email) {
        const trimmedEmail = req.body.email.trim();
        if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
          return res.status(400).json({ error: 'Invalid email format' });
        }
        account.email = trimmedEmail;
      }

      if (req.body.password) {
        const trimmedPassword = req.body.password.trim();
        if (trimmedPassword.length < 8) {
          return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }
        account.password = trimmedPassword;
      }

      account.updated_at = new Date();

      await account.save();

      const updatedUser = {
        id: account._id,
        username: account.username,
        email: account.email,
        roles: account.roles,
        created_at: account.created_at,
        updated_at: account.updated_at
      };

      res.json({ message: 'Account updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating account:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};


const getUploads = async (req, res) => {
  const token = req.headers['authorization'];
  const type = req.query.type;
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Failed to authenticate token:', err);
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    try {
      const userId = decoded.id;

      let uploads;

      if (type === 'wallpaper') {
        uploads = await Wallpaper.find({ account: userId });
      } else if (type === 'pfp') {
        uploads = await Pfp.find({ account: userId });
      } else {
        return res.status(400).json({ error: 'Invalid type specified' });
      }

      const formattedResults = uploads.map(upload => ({
        id: upload._id,
        title: upload.title,
        description: upload.description,
        type: upload.type,
        tags: upload.tags,
        imgId: upload.imgId,
        author: upload.account,
        createdAt: upload.createdAt,
      }));

      res.json({ uploads: formattedResults });

    } catch (error) {
      console.error('Error fetching uploads:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

module.exports = { register, login, getAccount, getUser, editCredentials, getUploads };
