const express = require('express');
const router = express.Router();
const facebookService = require('../services/facebookService');
const translations = require('../utils/translations');
const determineLanguage = require('../utils/languageUtils');
const facebookController = require('../controllers/facebookController');

let initWebRoutes = (app) => {
  router.get('/', facebookController.getHomePage);

  router.get('/webhook', facebookController.getWebhook);

  let replied = false;

  app.post('/webhook', async (req, res) => {
      const body = req.body;
      // const language = determineLanguage(body); 
  
      // Check if the server hasn't replied yet and the request is valid
      if (!replied && body.object === 'page' && body.entry) {
          try {

              // Process webhook event and send reply
              for (const entry of body.entry) {
                  for (const change of entry.changes) {
                    const commentMessage = change.value.message
                      if (change.value && change.value.item === 'comment' && change.value.verb === 'add') {
                          const commentId = change.value.comment_id;
                          const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
                          // multilingual 
                          let language = determineLanguage(change.value.message);
                          if(language == null) {
                            language = 'kh'
                          }
                          console.log("-----------------");
                          console.log(language);
                          console.log("-----------------");

                          // Get this information to mention the user.
                          const userInfo = facebookService.extractUserInfo(change);

                          if(userInfo) {
                            const {commenterId} = userInfo;
                            const message = `@[${commenterId}] ${translations[language].thankYouMessage}`;
                            await facebookService.postCommentReply(commentId, message, commentMessage, pageAccessToken);
                          } else {
                            console.error('Failed to extract user information from comment.')
                          }
                      }
                  }
              }
              replied = true; // Set flag to true after sending reply
              console.log('Reply sent successfully.');
  
              // Reset replied flag after a timeout (e.g., 5 seconds)
              setTimeout(() => {
                  replied = false;
                  console.log('Cooldown period expired. Ready to reply to new comments.');
              }, 5000); // Adjust cooldown period as needed (in milliseconds)
          } catch (error) {
              console.error('Failed to send reply:', error);
          }
      }
  
      res.status(200).send('EVENT_RECEIVED');
  });

  router.get('/set-up-profile', facebookController.getSetupProfilePage);

  router.post('/set-up-profile', facebookController.handleSetupProfile);

  router.get('/info-register', facebookController.getInfoRegisterPage);

  return app.use('/', router);
}

module.exports = initWebRoutes;

