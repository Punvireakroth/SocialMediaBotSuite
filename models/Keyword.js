const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
    keyword: { type: String, required: true },
    action: { type: String, required: true }
});

const Keyword = mongoose.model('Keyword', keywordSchema);

module.exports = Keyword;
