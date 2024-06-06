const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Environmental Variables
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE, PORT } = process.env;

// MongoDB Connection
(async () => {
  try {
    await mongoose.connect(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:27017/${MONGO_DATABASE}`, {
      retryWrites: true,
      writeConcern: { w: 'majority' },
      authSource: 'admin'
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
})();

app.use(bodyParser.json());


// Routes

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/auth', authRoutes);
app.use('/profile', authRoutes);


// Start Server
app.listen(PORT || 3000, () => {
  console.log(`Server running on port ${PORT || 3000}`);
});
