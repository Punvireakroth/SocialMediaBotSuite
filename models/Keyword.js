const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
    keyword: String,
    action: String // 'reply' or 'replyAndDirectMessage'
});

module.exports = mongoose.model('Keyword', keywordSchema);
