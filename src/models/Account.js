const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');

const SALT_ROUNDS = 10;

const imageToBase64 = (path) => {
  return fs.readFileSync(path, { encoding: 'base64' });
};

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  roles: {
    type: [String],
    default: ['user'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  activationToken: {
    type: String,
    unique: true,
  },
  verificationCode: { 
    type: String 
  },
  verificationCodeExpires: { 
    type: Date 
  },
  pfp: {
    type: Buffer,
  }
});

accountSchema.pre('save', function (next) {
  const account = this;

  if (!account.isModified('password')) return next();

  bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(account.password, salt, (err, hash) => {
      if (err) return next(err);
      account.password = hash;
      next();
    });
  });
});

accountSchema.pre('save', function (next) {
  const account = this;

  if (!account.activationToken) {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) return next(err);
      account.activationToken = buffer.toString('hex');
      next();
    });
  } else {
    next();
  }
});

accountSchema.pre('save', function (next) {
  const account = this;

  if (!account.pfp) {
    const base64Image = imageToBase64('./src/assets/logo.png');
    account.pfp = Buffer.from(base64Image, 'base64');
  }
  next();
});
accountSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

const Account = mongoose.model('Account', accountSchema, 'Accounts');

module.exports = Account;
