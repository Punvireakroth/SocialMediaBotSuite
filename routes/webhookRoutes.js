// src/routes/webhookRoutes.js

const express = require('express');
const router = express.Router();
require('dotenv').config();


// Import Facebook service
const facebookService = require('../services/facebookService');

// Webhook route to handle incoming Facebook events
router.get('/webhook', (req, res) => {
        // Your verify token. Should be a random string.
        const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    
        // Parse the query params
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];
    
        // Checks if a token and mode is in the query string of the request
        if (mode && token) {
    
            // Checks the mode and token sent is correct
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    
                // Responds with the challenge token from the request
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);
    
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
});


router.post('/webhook', async (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        // Iterate through each entry
        body.entry.forEach(async pageEntry => {
            if (pageEntry.messaging) {
                // Handle messaging events
                pageEntry.messaging.forEach(async messagingEvent => {
                    if (messagingEvent.message) {
                        // Handle incoming message event
                        console.log('Received message:', messagingEvent.message);
                    } else if (messagingEvent.comment) {
                        // Handle incoming comment event
                        console.log('Received comment:', messagingEvent.comment);
                        // Extract relevant information from the comment event
                        const { post_id, comment_id, message } = messagingEvent.comment;
                        // Check if the comment meets criteria for auto-reply
                        const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
                        const comments = await facebookService.readComments(post_id, accessToken, message);
                        // Post auto-replies to eligible comments
                        const reply = 'Check your message';
                        for (const comment of comments) {
                            const postId = comment.id.split('_')[0]; // Extract post ID from comment ID
                            try {
                                await facebookService.postCommentReply(postId, comment_id, reply, accessToken);
                                console.log('Auto-reply posted successfully');
                            } catch (error) {
                                console.error('Failed to post auto-reply:', error.response.data.error);
                            }
                        }
                    }
                });
            }
        });
    }

    res.sendStatus(200); 
});

module.exports = router;
