// Load environment variables from .env
require('dotenv').config()

// Import express
const express = require('express')

// Import cors
const cors = require('cors')

// Import routes
const routes = require('./routes')

// Import optional middleware (if used)
const appMiddleware = require('./middlewares/appMiddleware')

// Import DB connection file
require('./databaseConnection')

// Create express server instance
const bookstoreServer = express()

// Apply middlewares
bookstoreServer.use(cors())
bookstoreServer.use(express.json()) // Parse JSON request body
// bookstoreServer.use(appMiddleware) // Uncomment only if you have it defined

// Use your routes
bookstoreServer.use('/', routes)

// export uploads folder to frontend

bookstoreServer.use('/upload',express.static('./uploads'))

// Port configuration (⚠️ fix here)
const PORT = process.env.PORT || 4000

// Start the server
bookstoreServer.listen(PORT, () => {
  console.log(`✅ Server is running on port: ${PORT}`)
})
// export the pdfUploads folder from server

bookstoreServer.use('/pdfUploads',express.static('./pdfUploads'))


