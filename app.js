const express = require('express');
const configEngine = require('./config/viewEngine');
const initWebRoutes = require('./routes/webhookRoutes');
import bodyParser from 'body-parser'; 

require('dotenv').config();

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// View engine configuration
configEngine(app);

// Mount routes
initWebRoutes(app);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


