const express = require('express');
const router = express.Router();

const facebookController = require('../controllers/facebookController');
const keywordController = require('../controllers/keywordController.');

let initWebRoutes = (app) => {
  router.get('/', facebookController.getHomePage);

  router.get('/webhook', facebookController.getWebhook);

  app.post('/webhook', facebookController.postWebhook);

  router.get('/set-up-profile', facebookController.getSetupProfilePage);

  router.post('/set-up-profile', facebookController.handleSetupProfile);

  router.get('/info-register', facebookController.getInfoRegisterPage);

  router.post('/addKeyword', keywordController.addKeyword);

  router.get('/keywords', keywordController.getKeyword);


  return app.use('/', router);
}

module.exports = initWebRoutes;

