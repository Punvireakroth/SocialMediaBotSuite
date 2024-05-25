const express = require('express');
const mongoose = require('mongoose');
const configEngine = require('./config/viewEngine');
const initWebRoutes = require('./routes/webhookRoutes');
require('dotenv').config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine configuration
configEngine(app);

// Mount routes
initWebRoutes(app);

// Connect to MongoDB
const connectionURL = process.env.MONGO_URL;

mongoose.connect(connectionURL, {
}).then(() => {
    console.log('=======================================');

    console.log('Connected to MongoDB');

    console.log('=======================================');


    // Start the server after successful connection to MongoDB
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('=======================================');

    });
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the process with a failure code
});
