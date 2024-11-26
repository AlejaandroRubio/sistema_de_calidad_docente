const Survey = require('../models/Survey');

exports.createSurvey = async (req, res) => {
    const { title, description ,questions } = req.body;

    try{
        const newSurvey = new Survey({
            title,
            description,
            questions,
            user: req.user.userId
        });
        await newSurvey.save();
        res.status(201).json(newSurvey);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
};

exports.getSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find().populate('user', 'name');
        res.json(surveys);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
};