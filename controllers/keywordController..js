const Keyword = require('../models/Keyword');
const District = require('../models/District');


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


// Get all keywords
const getKeyword = async(req, res) => {
    try {
        const keywords = await Keyword.find();
        res.status(200).send(keywords);
      } catch (error) {
        res.status(500).send(error);
      }
}

// Get all location

const getLocation = async (req, res) => {
    try {
        const districts = await District.find();
        res.json(districts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addKeyword,
    getKeyword,
    getLocation,
};
