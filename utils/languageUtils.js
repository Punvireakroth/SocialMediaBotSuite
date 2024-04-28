// utils/languageUtils.js
const langdetect = require('langdetect');

function determineLanguage(comment) {
    // Check if the comment includes text
    if (comment) {
        const message = comment;

        // Detect language using cld.detect()
        const decodedText = decodeURIComponent(message);

        const detectionResult = langdetect.detect(decodedText);
        console.log(detectionResult);

        // Check if language is detected
        if (detectionResult) {
            // Get the detected language
            const detectedLanguage = detectionResult;

            // Map the detected language to a language code
            switch (detectedLanguage) {
                case 'en':
                    return 'en'; // English
                    break;
                case null:
                    return 'kh'; // Khmer
                    break;
                // Add more cases for other languages if needed
                default:
                    return 'en'; // Default to English if language is not supported
            }
        }
    }

    // Default to English if language cannot be detected or comment is empty
    // return 'en';
}

module.exports = determineLanguage;
