const express = require('express');
const router = express.Router();
import facebookController from '../controllers/facebookController';

let initWebRoutes = (app) => {
  router.get('/webhook', facebookController.getWebhook);
  router.post('/webhook', facebookController.postWebhook);

  return app.use('/', router);
}

module.exports = initWebRoutes;

