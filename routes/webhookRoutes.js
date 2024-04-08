// src/routes/webhookRoutes.js

const express = require('express');
const router = express.Router();

// Import Facebook service
const facebookService = require('../services/facebookService');

// Webhook route to handle incoming Facebook events
let initWebRoutes = (app) => {
    router.post('/webhook', async (req, res) => {
        const { object, entry } = req.body;

        if (object === 'page' && entry) {
            // Iterate through each entry
            entry.forEach(async pageEntry => {
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
                            const reply = 'Your auto-reply message here';
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

        res.sendStatus(200); // Respond to Facebook webhook with success
    });
}
module.exports = initWebRoutes;
