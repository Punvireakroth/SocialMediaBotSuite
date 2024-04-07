import axios from 'axios';



// Check if comment is eligible for auto-reply
async function checkCommentEligibility(contentData, pageAccessToken) {
    const commentUrl = `https://graph.facebook.com/v6.0/${contentData.id}/comments`;
    const params = { access_token: pageAccessToken };
    const url = `${commentUrl}?${new URLSearchParams(params)}`;
    try {
        const response = await axios.get(url);
        const content = response.data;
        return !content.data.length;
    } catch (error) {
        console.error('Unable to connect. Check if session is still valid');
        return false;
    }
}   


// Get detials from Facebook API

async function getDetails(accessToken, url, parameter, valid, ID) {
    const params = { access_token: accessToken };
    const getURL = `${url}?${new URLSearchParams(params)}`;
    try {
        const response = await axios.get(getURL);
        const content = response.data;
        return content.data.find(item => item[parameter] === value);
    } catch (error) {
        console.error('Unable to connect. Check if session is still valid');
        return null;
    }
}

// Function to read comments of a particular post 

async function readComments(postID, pageAccessToken, commentMsg) {
    const comments = [];
    const readCommentsUrl = `https://graph.facebook.com/v2.1/${postID}/comments`;
    const params = { access_token: pageAccessToken };
    const url = `${readCommentsUrl}?${new URLSearchParams(params)}`;
    try {
        const response = await axios.get(url);
        const content = response.data;
        content.data.forEach(comment => {
            if(comment.message === commentMsg && checkCommentEligibility(comment, pageAccessToken)) {
                comments.push(comment);
            }
        });
        return comments;
    } catch (error) {
        console.log('Unable to connect. Check if session is still valid');
        return [];
    }
}


module.exports = {
    checkCommentEligibility,
    getDetails,
    readComments
}