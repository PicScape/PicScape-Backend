const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const SALT_ROUNDS = 10;

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

accountSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

const Account = mongoose.model('Account', accountSchema, 'Accounts');

module.exports = Account;
