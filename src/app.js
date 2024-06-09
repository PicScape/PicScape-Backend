const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToMongoDB } = require('./mongo');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());

//MONGO
connectToMongoDB();


//ROUTES
app.use('/auth', routes.authRoutes);
app.use('/fetch', routes.fetchRoutes);
app.use('/upload', routes.uploadRoutes);
app.use('/image', routes.imageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
