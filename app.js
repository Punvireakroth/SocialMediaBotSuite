import express from 'express';
import configEngine from './config/viewEngine';
import initWebRoutes from './routes/web';
import bodyParser from 'body-parser'; 
require('dotenv').config;

let app = express();

// Add middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configEngine(app);


initWebRoutes(app);


let port = process.env.PORT || 8080;

app.listen(port , () => {
    console.log(`SERVER RUNNING ON PORT ${port}`)
});