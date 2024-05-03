require('dotenv').config();
import request from 'request';
import homepageService from './homepageService';
import messageTemplate from './messageTemplate';



// Sends response messages via the Send API
let sendMessage = (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
        try {
            await homepageService.markMessageRead(sender_psid);
            await homepageService.sendTypingOn(sender_psid);
            // Construct the message body
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": {
                    "access_token": process.env.PAGE_ACCESS_TOKEN
                },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('message sent!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let handleFirstUser = (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await homepageService.getUserName(sender_psid);
            let firstResponse = {
                "text": `👋 សួស្ដី, ${username} ❤️! អរគុណសម្រាប់ការទំនាក់ទំនងមកកាន់យើងខ្ញុំ 🤔 \n\n តើមានអ្វីខ្ញុំអាចជួយអ្នកបាន?`
            };

            // send an image
            let secondResponse = {
                "attachment": {
                    'type': 'image',
                    'payload': {
                        'url': 'https://i.pinimg.com/564x/4f/a9/65/4fa965953eca58e83539070ba49bc800.jpg',
                    }
                }
            }

            // Quick reply to learn more about product
            let learnMore = {
                "text": "ចុចប៊ូតុងខាងក្រោមដើម្បីទទួលបានពត៍មានបន្ថែម",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "ពត៍មានបន្ថែម",
                    "payload": "LEARN_MORE",
                }],
            };
            await sendMessage(sender_psid, firstResponse);
            await sendMessage(sender_psid, secondResponse);
            await sendMessage(sender_psid, learnMore);

            resolve('DONE');
        } catch (e) {
            reject(e);
        }
    });
};

let sendLearnMore = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Send a generic template message

            let response = messageTemplate.sendLearnMoreTemplate();

            await sendMessage(sender_psid, response);

            resolve('Done');
        } catch (e) {
            reject(e);
        }
    });
};

let handleProductDetial = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Inside handleProductDetial function');
    
            // Get the information and askPrice from the template
            let response = messageTemplate.handleProductDetialTemplate();

            // Send the information
            await sendMessage(sender_psid, response);
            resolve('Done');
        } catch (e) {
            console.error('Error in handleProductDetial:', e);
            reject(e);
        }
    });
}

let requestPricesOptions =  (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Inside handleProductDetial function');
            
            // Get the information and askPrice from the template
            let response = messageTemplate.requestPricesOptionsTemplate();

            // Send the information
            await sendMessage(sender_psid, response);

            resolve('Done');
        } catch (e) {
            reject(e);
        }
    });
}


let vendorInformation = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Inside handleProductDetial function');
            
            // response from the template
            let {response, registerUser} = messageTemplate.vendorInformationTemplate();            

            // Send the Vendor informations
            await sendMessage(sender_psid, response);
            await sendMessage(sender_psid, registerUser);


            resolve('Done');
        } catch(e) {
            reject(e);
        }
    });
}

let sendLookupRegister = (sender_psid) => {
    return new Promise(async(resolve, reject) => {
        try {
            let response = messageTemplate.sendLookupRegisterTemplate();
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
}


let setInfoRegisterByWebView = (sender_psid) => {
    return new Promise(async(resolve, reject) => {
        try {

        } catch (e) {
            reject(e);
        }
    });
}


let backToMainMenu = (sender_psid) => {
    return new Promise(async(resolve, reject) => {
        try {
            let {response, registerUser} = messageTemplate.vendorInformationTemplate();            
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
}

let requestTalkToAgent = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {

        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    sendMessage,
    handleFirstUser,
    sendLearnMore,
    requestTalkToAgent,
    handleProductDetial,
    requestTalkToAgent,
    requestPricesOptions,
    vendorInformation,
    sendLookupRegister,
    setInfoRegisterByWebView,
    backToMainMenu
};