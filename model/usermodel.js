const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: String }, // For Google login
    bio: { type: String, default: "Bookstore user..." }
}, { timestamps: true });

module.exports = mongoose.model("users", userSchema);
