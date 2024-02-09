const express = require('express');
const cors = require('cors');
const uploadRoute = require('./routes/uploadRoute');
const searchRoute = require('./routes/searchRoute');
const randomRoute = require('./routes/randomRoute');
const idFetch = require('./routes/idFetch');
const { createImagesFolder } = require('./utils');

const app = express();
app.use(cors());
const port = 3000;

createImagesFolder();

app.use('/uploads', express.static('uploads'));
app.use(uploadRoute);
app.use(searchRoute);
app.use(randomRoute);
app.use(idFetch); 

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
