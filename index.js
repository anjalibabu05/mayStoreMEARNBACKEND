require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('./databaseConnection');

const bookstoreServer = express();

bookstoreServer.use(cors());
bookstoreServer.use(express.json());

// static folders
bookstoreServer.use('/upload', express.static('./uploads'));
bookstoreServer.use('/pdfUploads', express.static('./pdfUploads'));

// main routes
bookstoreServer.use('/', routes);

const PORT = process.env.PORT || 4000;
bookstoreServer.listen(PORT, () => {
  console.log(`✅ Server is running on port: ${PORT}`);
});
