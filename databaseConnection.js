const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectionString = process.env.DATABASE;
console.log("DB Connection String:", connectionString);

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.log("❌ MongoDB connection failed:", err));
