const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  tittle: { type: String, required: true },
  author: { type: String, required: true },
  noOfPages: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  dPrice: { type: Number, required: true },
  abstract: { type: String, required: true },
  publisher: { type: String, required: true },
  language: { type: String, required: true },
  isbn: { type: String, required: true },
  category: { type: String, required: true },
  uploadimages: { type: [String], required: true }, // ✅ array of filenames
  status: { type: String, required: true },
  userEmail: { type: String, required: true },
  brought: { type: String, default: "" }
});

const books = mongoose.model('books', bookSchema);
module.exports = books;
