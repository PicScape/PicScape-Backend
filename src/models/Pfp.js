const mongoose = require('mongoose');

const pfpSchema = new mongoose.Schema({
  title: String,
  image: Buffer, // Store image data as a Buffer
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  }
});

const Pfp = mongoose.model('Pfp', pfpSchema, 'Pfps');

module.exports = Pfp;
