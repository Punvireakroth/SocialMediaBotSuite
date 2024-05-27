// models/District.js
const mongoose = require('mongoose');

const DistrictSchema = new mongoose.Schema({
    name: { type: String, required: true },
    commentId: { type: String, required: true },
    detectedAt: { type: Date, default: Date.now }
});

const District = mongoose.model('District', DistrictSchema);

module.exports = District;
