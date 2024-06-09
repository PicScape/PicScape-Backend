const mongoose = require('mongoose');

const wallpaperSchema = new mongoose.Schema({
  title: String,
  image: Buffer, // Store image data as a Buffer
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  }
});

const Wallpaper = mongoose.model('Wallpaper', wallpaperSchema, 'Wallpapers');

module.exports = Wallpaper;
