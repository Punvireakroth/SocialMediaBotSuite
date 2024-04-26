const express = require('express');
const router = express.Router();
const facebookService = require('../services/facebookService');

let initWebRoutes = (app) => {
  router.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.sendStatus(403);
    }
  });


  // Endpoint for receiving Facebook webhook events
  app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object === 'page' && body.entry) {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.item === 'comment' && change.value.verb === 'add') {
            const comment = change.value;
            console.log(comment.comment_id);
            // Reply to the comment
            try {
              await facebookService.postCommentReply(comment.comment_id, 'Thank you for your comment!', process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
              console.log('Reply sent successfully.');
            } catch (error) {
              console.error('Failed to send reply:', error);
            }
          }
        }
      }
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  });
  return app.use('/', router);
}

module.exports = initWebRoutes;


//     router.post('/webhook', async (req, res) => {
//         const body = req.body;
//         if (body.object === 'page') {
//             // Iterate through each entry
//             body.entry.forEach(async pageEntry => {
//                 if (pageEntry.messaging) {
//                     // Handle messaging events
//                     pageEntry.messaging.forEach(async messagingEvent => {
//                         if (messagingEvent.comment) {
//                             // Handle incoming comment event
//                             console.log('Received comment:', messagingEvent.comment);
//                             // Extract relevant information from the comment event
//                             const { post_id, comment_id, message } = messagingEvent.comment;
//                             console.log(`-----------------------`)
//                             console.log(`${post_id} | ${comment_id}, ${message}`)
//                             console.log(`-----------------------`)

//                             // Check if the comment meets criteria for auto-reply
//                             const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

//                             console.log(`-----------------------`)
//                             console.log(`This is my access token ${accessToken}`)
//                             console.log(`-----------------------`)
//                             const comments = await facebookService.readComments(post_id, accessToken, message);
//                             // Post auto-replies to eligible comments
//                             const reply = 'Check your message';
//                             for (const comment of comments) {
//                                 const postId = comment.id.split('_')[0]; // Extract post ID from comment ID
//                                 try {
//                                     await facebookService.postCommentReply(postId, comment_id, reply, accessToken);
//                                     console.log('Auto-reply posted successfully');
//                                 } catch (error) {
//                                     console.error('Failed to post auto-reply:', error.response.data.error);
//                                 }
//                             }
//                         }
//                     });
//                 }
//             });
//         }

//         res.sendStatus(200);
//     });
//     return app.use('/', router);
// };

// module.exports = initWebRoutes;


// router.post('/webhook', async (req, res) => {
//     const body = req.body;

//     if (body.object === 'page') {
//         body.entry.forEach(async pageEntry => {
//             if (pageEntry.messaging) {
//                 pageEntry.messaging.forEach(async messagingEvent => {
//                     if (messagingEvent.message) {
//                         console.log('Received message:', messagingEvent.message);
//                     } else if (messagingEvent.comment) {
//                         console.log('Received comment:', messagingEvent.comment);
//                         const { post_id, comment_id, message } = messagingEvent.comment;
//                         const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
//                         const comments = await facebookService.readComments(post_id, accessToken, message);
//                         const reply = 'Check your message';
//                         for (const comment of comments) {
//                             const postId = comment.id.split('_')[0];
//                             try {
//                                 await facebookService.postCommentReply(postId, comment_id, reply, accessToken);
//                                 console.log('Auto-reply posted successfully');
//                             } catch (error) {
//                                 console.error('Failed to post auto-reply:', error.response.data.error);
//                             }
//                         }
//                     }
//                 });
//             }
//         });
//     }

//     res.sendStatus(200);
// });

