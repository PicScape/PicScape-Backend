const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size'); 

function generateRandomImgId() {
  return Math.floor(10000 + Math.random() * 90000);
}

const pfpSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
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
  },
  uploadedDate: {
    type: Date,
    default: Date.now
  }
});


pfpSchema.pre('save', async function(next) {
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

    if (!doc.uploadedDate) {
      doc.uploadedDate = new Date();
    }
  }

  next();
});
const Pfp = mongoose.model('Pfp', pfpSchema, 'Pfps');

module.exports = Pfp;


