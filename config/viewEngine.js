import express from 'express';


let configEngine = (app) => {
    app.use(express.static('./src/public'));
    app.set('view engine', 'ejs');
    app.set('views', './views');

}

module.exports =  configEngine;