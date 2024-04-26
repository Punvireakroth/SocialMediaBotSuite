import axios from 'axios';



// Check if comment is eligible for auto-reply
// async function checkCommentEligibility(contentData, pageAccessToken) {
//     const commentUrl = `https://graph.facebook.com/v19.0/${contentData.id}/comments`;
//     const params = { access_token: pageAccessToken };
//     const url = `${commentUrl}?${new URLSearchParams(params)}`;
//     try {
//         const response = await axios.get(url);
//         const content = response.data;
//         return !content.data.length;
//     } catch (error) {
//         console.error('Unable to connect. Check if session is still valid');
//         return false;
//     }
// }


// Get detials from Facebook API

// async function getDetails(accessToken, url, parameter, valid, ID) {
//     const params = { access_token: accessToken };
//     const getURL = `${url}?${new URLSearchParams(params)}`;
//     try {
//         const response = await axios.get(getURL);
//         const content = response.data;
//         return content.data.find(item => item[parameter] === value);
//     } catch (error) {
//         console.error('Unable to connect. Check if session is still valid');
//         return null;
//     }
// }

// Function to read comments of a particular post 

// async function readComments(postID, pageAccessToken, commentMsg) {
//     const comments = [];
//     const readCommentsUrl = `https://graph.facebook.com/v19.0/${postID}/comments`;
//     const params = { access_token: pageAccessToken };
//     const url = `${readCommentsUrl}?${new URLSearchParams(params)}`;
//     try {
//         const response = await axios.get(url);
//         const content = response.data;
//         content.data.forEach(comment => {
//             if (comment.message === commentMsg && checkCommentEligibility(comment, pageAccessToken)) {
//                 comments.push(comment);
//             }
//         });
//         return comments;
//     } catch (error) {
//         console.log('Unable to connect. Check if session is still valid');
//         return [];
//     }
// }

// post comment reply 

// Maintain a Set to store replied comment IDs
const repliedCommentIds = new Set();

async function postCommentReply(commentId, message, accessToken) {
    // Check if the comment ID has already been replied to
    if (repliedCommentIds.has(commentId)) {
        console.log('Comment already replied to:', commentId);
        return; 
    }

    const postUrl = `https://graph.facebook.com/${commentId}/comments?access_token=${accessToken}`;
    console.log(postUrl);
    try {
        const response = await axios.post(postUrl, { message });
        console.log('Comment reply posted successfully:', response.data);
        // Add the comment ID to the Set of replied comment IDs
        repliedCommentIds.add(commentId);
    } catch (error) {
        console.error('Failed to post comment reply:', error.response.data);
        throw new Error('Failed to post comment reply');
    }
}


// async function mentionClient()
// async function sendMessage(sender_psid, message) {
//     try {
//       await axios.post(`https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`, {
//         recipient: {
//           id: sender_psid
//         },
//         message: {
//           text: message
//         }
//       });
//       console.log('Message sent successfully');
//     } catch (error) {
//       console.error('Unable to send message:', error);
//     }
// }

module.exports = {
    // checkCommentEligibility,
    // getDetails,
    // readComments,
    postCommentReply,
    // sendMessage
}