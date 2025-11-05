require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('./databaseConnection');

const bookstoreServer = express();

// CORS configuration
const allowedOrigins = [
  'https://may-store-mearn-h3dg.vercel.app',
  'http://localhost:5173',
];

bookstoreServer.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// JSON parser
bookstoreServer.use(express.json());

// Static folders
bookstoreServer.use('/upload', express.static('./uploads'));
bookstoreServer.use('/pdfUploads', express.static('./pdfUploads'));

// Main routes
bookstoreServer.use('/', routes);

// Start server
const PORT = process.env.PORT || 4000;
bookstoreServer.listen(PORT, () => {
  console.log(`✅ Server is running on port: ${PORT}`);
});
