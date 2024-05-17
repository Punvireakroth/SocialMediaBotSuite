const express = require('express');
const router = express.Router();
const facebookService = require('../services/facebookService');
const translations = require('../utils/translations');
const determineLanguage = require('../utils/languageUtils');
const facebookController = require('../controllers/facebookController');
const chatbotService = require('../services/chatbotService');
const messageTemplate = require('../services/messageTemplate');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();

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
              // Extract user ID of the commenter
              const commentersId = change.value.from.id;

              // Perform sentiment analysis on the comment
              const commentSentiment = sentiment.analyze(commentMessage);
              console.log(commentSentiment);

              // multilingual 
              let language = determineLanguage(change.value.message);
              if (language == null) {
                language = 'kh'
              }

              let replyMessage;

              // Get this information to mention the user.
              const userInfo = facebookService.extractUserInfo(change);

              if (userInfo) {
                const { commenterId } = userInfo;
                if (commentSentiment.score >= 2 && commentSentiment.score >= 1) {
                  // Express interest in the product
                  replyMessage = `@[${commenterId}] ${translations[language].interestResponse}`;
                  // Send direct message for expressing interest
                  const directMessage = messageTemplate.sendLearnMoreTemplate();
                  await chatbotService.sendMessage(commentersId, directMessage);
                }
                else if (commentSentiment.score > 0) {
                  // Positive sentiment: Thank the user
                  replyMessage = `@[${commenterId}] ${translations[language].thankYouMessage}`;
                  await facebookService.postCommentReply(commentId, replyMessage, commentMessage, pageAccessToken);
                  
                } else if (commentSentiment.score < 0) {
                  // Send sorry image 
                  // Reply comment with a gratitude message
                  const imageUrl = "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg";
                  // Negative sentiment: Adress complaint/feedback
                  const directMessage = messageTemplate.sendFeedbackTemplate();
                  replyMessage = `@[${commenterId}] ${translations[language].complaintResponse}`;
                  await facebookService.postCommentReply(commentId, replyMessage, commentMessage, pageAccessToken, imageUrl);
                  // Direct message to make up the user ecompliant
                  await chatbotService.sendMessage(commentersId, directMessage);
                }
                // await facebookService.postCommentReply(commentId, replyMessage, commentMessage, pageAccessToken);

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
        }, 9000); // Adjust cooldown period as needed (in milliseconds)
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

