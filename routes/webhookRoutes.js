const express = require('express');
const router = express.Router();
import facebookController from '../controllers/facebookController';

let initWebRoutes = (app) => {
  router.get('/', facebookController.getHomePage);

  router.get('/webhook', facebookController.getWebhook);

  router.post('/webhook', facebookController.postWebhook);

  router.get('/set-up-profile', facebookController.getSetupProfilePage);

  router.post('/set-up-profile', facebookController.handleSetupProfile);

  router.get('/info-register', facebookController.getInfoRegisterPage);

  return app.use('/', router);
}

module.exports = initWebRoutes;

