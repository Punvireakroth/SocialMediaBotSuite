// services/translationService.js

const translate = require('translate-google');

async function translateText(text, targetLanguage = 'en') {
    try {
        const translation = await translate(text, { to: targetLanguage });
        return translation;
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

module.exports = {
    translateText
};
