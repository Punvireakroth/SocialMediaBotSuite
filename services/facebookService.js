import axios from 'axios';
require('dotenv').config();
import request from 'request';


// Maintain a Set to store replied comment IDs
const repliedCommentIds = new Set();

async function postCommentReply(commentId, message, commentMessage, accessToken, imageUrl = null) {
    // Check if the comment ID has already been replied to
    if (repliedCommentIds.has(commentId)) {
        console.log('Comment already replied to:', commentId);
        return; 
    }

    const postUrl = `https://graph.facebook.com/${commentId}/comments?access_token=${accessToken}`;

    try {
        let payload;

        if (imageUrl) {
            payload = {
                message: message,
                attachment_url: imageUrl
            };
        } else {
            payload = {
                message: message
            };
        }
        
        const response = await axios.post(postUrl, payload);
        console.log('Comment reply posted successfully to:', commentMessage, response.data);
        // Add the comment ID to the Set of replied comment IDs
        repliedCommentIds.add(commentId);
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.error &&
            error.response.data.error.error_subcode === 33
        ) {
            // Ignore the error if it's due to the comment already being replied to
            console.log('Comment already replied to:', commentId);
        } else {
            console.error('Failed to post comment reply:', error.response.data);
            throw new Error('Failed to post comment reply');
        }
    }
}

// Mention client name
function extractUserInfo(comment) {
    if(comment && comment.value && comment.value.from) {
        const fromObject = comment.value.from;
        const commenterId = fromObject.id;
        return { commenterId };
    }
}


// --------************************** Messenger Platform services ********************-----------------

let handleSetupProfileAPI = () => {
    return new Promise((resolve, reject) => {
        try {
            let url = `https://graph.facebook.com/v6.0/me/messenger_profile?access_token=${process.env.PAGE_ACCESS_TOKEN}`;
            let request_body = {
                "get_started": {
                    "payload": "GET_STARTED"
                },
                "persistent_menu": [
                    {
                        "locale": "default",
                        "composer_input_disabled": false,
                        "call_to_actions": [
                            {
                                "type": "postback",
                                "title": "Talk to customer support",
                                "payload": "TALK_AGENT"
                            },
                            {
                                "type": "postback",
                                "title": "Restart this conversation",
                                "payload": "RESTART"
                            },
                        ]
                    }
                ],
                "whitelisted_domains": [
                    "https://ff87-2a0d-5600-44-6000-00-acb9.ngrok-free.app/",

                ],

            };
            request({
                "uri": url,
                "method": "POST",
                "json": request_body,
            }, (err, res, body) => {
                if (!err) {
                    // console.log(body);
                    resolve('DONE')
                } else {
                    reject('Unable to send message' + err)
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

let getUserName = (serder_psid) => {
    let url = `https://graph.facebook.com/${serder_psid}?fields=first_name,last_name,profile_pic&access_token=${process.env.PAGE_ACCESS_TOKEN}`
    return new Promise((resolve, reject) => {
        try {
            request({
                "uri": url,
                "method": "GET",
            }, (err, res, body) => {
                if (!err) {
                    body = JSON.parse(body);
                    let username = `${body.first_name} ${body.last_name}`;
                    resolve(username);
                } else {
                    reject('Unable to send message' + err)
                }
            });

        } catch (e) {
            reject(e)
        }
    });
}

let sendTypingOn = (sender_psid) => {
    return new Promise((resolve, reject) => {
        let request_body = {
            "recipient": {
                "id": sender_psid,
            },
            "sender_action": "typing_on"
        }
        let url = `https://graph.facebook.com/v2/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN};`;
        try {
            request({
                "uri": url,
                "method": "GET",
                "json": request_body,
            }, (err, res, body) => {
                if (!err) {
                    resolve("Done");
                } else {
                    reject('Unable to send message' + err)
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let markMessageRead = (sender_psid) => {
    return new Promise((resolve, reject) => {
        let request_body = {
            "recipient": {
                "id": sender_psid,
            },
            "sender_action": "mark_seen"
        }
        let url = `https://graph.facebook.com/v2/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN};`;
        try {
            request({
                "uri": url,
                "method": "GET",
                "json": request_body,
            }, (err, res, body) => {
                if (!err) {
                    resolve("Done");
                } else {
                    reject('Unable to send message' + err)
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    extractUserInfo,
    postCommentReply,
    handleSetupProfileAPI,
    getUserName,
    sendTypingOn,
    markMessageRead,
}