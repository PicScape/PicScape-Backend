const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
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

module.exports = { register, login, getAccount, getUser };
