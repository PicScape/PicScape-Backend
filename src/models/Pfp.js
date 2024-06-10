const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size'); 

const pfpSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4, // Generate a UUID by default
    required: true
  },
  imgId: {
    type: Number,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  tags: {
    type: [String],
    required: true
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
  
  // Ensure 1:1 aspect ratio before saving
  if (doc.image) {
    const imageBuffer = Buffer.from(doc.image, 'base64');
    const dimensions = sizeOf(imageBuffer);
    const width = dimensions.width;
    const height = dimensions.height;
    if (width !== height) {
      const error = new Error('Image dimensions must be 1:1');
      return next(error);
    }
  }

  next();
});

const Pfp = mongoose.model('Pfp', pfpSchema, 'Pfps');

module.exports = Pfp;

function generateRandomImgId() {
  return Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
}
