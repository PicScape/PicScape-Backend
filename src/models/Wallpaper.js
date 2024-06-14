const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

function generateRandomImgId() {
  return Math.floor(10000 + Math.random() * 90000);
}

const wallpaperSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuidv4
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
  description: {
    type: String
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
  },
  uploadedDate: {
    type: Date,
    default: Date.now
  }
});

wallpaperSchema.pre('save', async function(next) {
  const doc = this;

  if (doc.isNew) {
    if (!doc.imgId) {
      let imgId;
      do {
        imgId = generateRandomImgId();
        const existingPfp = await mongoose.model('Pfp').findOne({ imgId });
        const existingWallpaper = await mongoose.model('Wallpaper').findOne({ imgId });
        if (!existingPfp && !existingWallpaper) {
          doc.imgId = imgId;
          break;
        }
      } while (true);
    }

    if (!doc.uploadedDate) {
      doc.uploadedDate = new Date();
    }
  }

  next();
});


const Wallpaper = mongoose.model('Wallpaper', wallpaperSchema, 'Wallpapers');

module.exports = Wallpaper;


