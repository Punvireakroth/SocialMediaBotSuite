const express = require('express');
const configEngine = require('./config/viewEngine');
const webhookRoutes = require('./routes/webhookRoutes');
require('dotenv').config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// View engine configuration
configEngine(app);

// Mount routes
app.use('/', webhookRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// const express = require('express');
// require('dotenv').config();

// // Import routes
// const webhookRoutes = require('./routes/webhookRoutes');

// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Mount routes
// app.use('/', webhookRoutes);

// // Start server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
