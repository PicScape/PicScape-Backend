const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToMongoDB } = require('./mongo');
const routes = require('./routes');
const isAdmin = require('./middleware/isAdmin');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json());

//MONGO
connectToMongoDB();


// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).send({ error: 'Invalid request' });
});


//ROUTES
app.use('/auth', routes.authRoutes);
app.use('/fetch', routes.fetchRoutes);
app.use('/upload', routes.uploadRoutes);
app.use('/image', routes.imageRoutes);
app.use('/admin', isAdmin, routes.adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
