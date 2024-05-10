require('dotenv').config();

const facebookService = require('../services/facebookService');
const chatbotService = require('../services/chatbotService');
// const translations = require('../utils/translations');
// const determineLanguage = require('../utils/languageUtils');
// import messageTemplate from '../services/messageTemplate';



let getWebhook = (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
};




// -------------------**************** END ************--------------------


//      // Checks if this is an event from a page subscription
//      if (body.object === 'page' && replied) {

//         // Iterates over each entry - there may be multiple if batched
//         body.entry.forEach(function (entry) {

//             // Gets the body of the webhook event
//             let webhookEvent = entry.messaging[0];
//             console.log(webhookEvent);

//             // Get the sender PSID
//             let senderPsid = webhookEvent.sender.id;
//             console.log('Sender PSID: ' + senderPsid);

//             // Check if the event is a message or postback and
//             // pass the event to the appropriate handler function
//             if (webhookEvent.message) {
//                 handleMessage(senderPsid, webhookEvent.message);
//             } else if (webhookEvent.postback) {
//                 handlePostback(senderPsid, webhookEvent.postback);
//             }
//         });

//         // Returns a '200 OK' response to all requests
//         res.status(200).send('EVENT_RECEIVED');
//     } else {

//         // Returns a '404 Not Found' if event is not from a page subscription
//         res.sendStatus(404);
//     }





// --------------********************setup facebook profile for messenger platform ********************-------------------

let getHomePage = (req, res) => {
    return res.render("homepage.ejs");
};

let handleSetupProfile = async (req, res) => {
    try {
        await facebookService.handleSetupProfileAPI();
        console.log('Set up Sucess')
        return res.redirect('/');
    } catch (e) {
        console.log(e);
    }

    await facebookService.handleSetupProfileAPI();
}

let getSetupProfilePage = (req, res) => {
    return res.render("profile.ejs");
};

let getInfoRegisterPage = (req, res) => {
    return res.render("infoRegister.ejs");
};


// Handle messages events

let handleMessage = async (sender_psid, received_message) => {
    // Check if incoming message is a quick reply 
    if (received_message && received_message.quick_reply && received_message.quick_reply.payload) {
        let payload = received_message.quick_reply.payload;
        if (payload === 'LEARN_MORE') {
            await chatbotService.sendLearnMore(sender_psid);
        } else if (payload === 'REGISTER_USER') {
            await chatbotService.sendLookupRegister(sender_psid);
        } else if (payload === 'TALK_AGENT') {
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
    switch (payload) {
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
    handleSetupProfile,
    getSetupProfilePage,
    getInfoRegisterPage,
    getHomePage,
    handleMessage,
    handlePostback
}