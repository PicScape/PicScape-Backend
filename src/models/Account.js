const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// Define the schema for accounts
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
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash the password before saving it to the database
accountSchema.pre('save', function(next) {
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

// Method to compare given password with the database hash
accountSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// Model the schema
const Account = mongoose.model('Account', accountSchema, 'Accounts');

module.exports = Account;
