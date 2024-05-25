const Keyword = require('../models/Keyword');

const addKeyword = async (req, res) => {
    const { keyword, action } = req.body;

    try {
        const newKeyword = new Keyword({ keyword, action });
        await newKeyword.save();
        res.status(200).send('Keyword added successfully');
    } catch (error) {
        res.status(500).send('Error adding keyword: ' + error.message);
    }
};

module.exports = {
    addKeyword,
};
