require('dotenv').config();

const facebookService = require('../services/facebookService');
const translations = require('../utils/translations');
const determineLanguage = require('../utils/languageUtils');


let getWebhook = (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
};

let replied = false;

let postWebhook = async (req, res) => {
    const body = req.body;
    // const language = determineLanguage(body); 

    // Check if the server hasn't replied yet and the request is valid
    if (!replied && body.object === 'page' && body.entry) {
        try {
            // Process webhook event and send reply
            for (const entry of body.entry) {
              console.log(entry.changes);
                for (const change of entry.changes) {
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
                          await facebookService.postCommentReply(commentId, message, pageAccessToken);
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
}


// setup facebook profile for messenger platform

let getHomePage = (req, res) => {
    return res.render("homepage.ejs");
};

let handleSetupProfile = async (req, res) => {
    try {
        await homepageService.handleSetupProfileAPI();
        return res.redirect('/');
    } catch(e) {
        console.log(e);
    }

    await homepageService.handleSetupProfileAPI();
}

let getSetupProfilePage = (req, res) => {
    return res.render("profile.ejs");
};

let getInfoRegisterPage = (req, res) => {
    return res.render("infoRegister.ejs");
};


// Handle messages events

let handleMessage = async (sender_psid, received_message) =>{
    // Check if incoming message is a quick reply 
    if(received_message && received_message.quick_reply && received_message.quick_reply.payload) {
        let payload = received_message.quick_reply.payload;
        if(payload === 'LEARN_MORE') {
            await chatbotService.sendLearnMore(sender_psid);
        }else if(payload === 'REGISTER_USER') {
            await chatbotService.sendLookupRegister(sender_psid);
        } else if(payload === 'TALK_AGENT') {
            await chatbotService.requestTalkToAgent(sender_psid);
        }
        return;
    } 


    let response;

    // Check if the message contains text
    if (received_message.text) {

        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    } else if (received_message.attachments) {

        // Gets the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;

        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [{
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Sends the response message
    await chatbotService.sendMessage(sender_psid, response);
}

// Handles messaging_postbacks events (When the user click on facebook button)
let handlePostback = async (sender_psid, received_postback) => {
    let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
    switch(payload) {
        case 'GET_STARTED':
            await chatbotService.handleFirstUser(sender_psid);
            break;
        case 'RESTART':
            await chatbotService.handleFirstUser(sender_psid);
            break;
        case 'DETIAL_INFO':
            await chatbotService.handleProductDetial(sender_psid);
            break;
        case 'TALK_AGENT':
            await chatbotService.requestTalkToAgent(sender_psid);
            break;
        case 'ASK_PRICE':
            await chatbotService.requestPricesOptions(sender_psid);
            break;
        case 'ASK_INFO':
            await chatbotService.vendorInformation(sender_psid);
            break;
        case 'SET_INFO_REGISTER':
            await chatbotService.setInfoRegisterByWebView(sender_psid);
            break;
        case 'BACK_TO_MAIN_MENU':
            await chatbotService.backToMainMenu(sender_psid);
        default:
            console.log('Run default switch case');

    }
  // Send the message to acknowledge the postback
    await chatbotService.sendMessage(sender_psid, response);
}


module.exports = {
    getWebhook,
    postWebhook,
    handleSetupProfile,
    getSetupProfilePage,
    getInfoRegisterPage,
    getHomePage,
    handleMessage,
}