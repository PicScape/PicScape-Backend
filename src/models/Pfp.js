const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const pfpSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4 // Generate a UUID by default
  },
  title: String,
  image: Buffer, // Store image data as a Buffer
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  tags: [String], // Array of tags
  imgId: {
    type: Number,
    unique: true
  }
});

pfpSchema.pre('save', async function(next) {
  const doc = this;
  if (!doc.imgId) {
    let imgId;
    do {
      imgId = generateRandomImgId(); // Generate a new 5-digit number
      // Check if imgId already exists in 'Pfp' or 'Wallpaper' collection
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

const Pfp = mongoose.model('Pfp', pfpSchema, 'Pfps');

module.exports = Pfp;

function generateRandomImgId() {
  return Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
}
