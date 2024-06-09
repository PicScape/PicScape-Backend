const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const wallpaperSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4 // Generate a UUID by default
  },
  imgId: {
    type: Number,
    unique: true
  },
  type: String,
  title: String,
  image: Buffer, // Store image data as a Buffer
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  tags: [String] // Array of tags
  
});

wallpaperSchema.pre('save', async function(next) {
  const doc = this;
  if (!doc.imgId) {
    let imgId;
    do {
      imgId = generateRandomImgId(); // Generate a new 5-digit number
      const existingPfp = await mongoose.model('Pfp').findOne({ imgId });
      const existingWallpaper = await mongoose.model('Wallpaper').findOne({ imgId });
      if (!existingPfp && !existingWallpaper) {
        doc.imgId = imgId;
        break;
      }
    } while (true);
  }
  next();
});

const Wallpaper = mongoose.model('Wallpaper', wallpaperSchema, 'Wallpapers');

module.exports = Wallpaper;

function generateRandomImgId() {
  return Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
}
