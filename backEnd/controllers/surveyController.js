const Survey = require('../models/Survey');

//#region createSurvey
exports.createSurvey = async (req, res) => {
    const { title, description ,questions } = req.body;
    const {userId} = req.user;

    try{
        const newSurvey = new Survey({
            title,
            description,
            questions,
            user: userId
            
        });

        await newSurvey.save();
        res.status(201).json(newSurvey);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
};
//#endregion

//#region getSurveys
exports.getSurveyssummarized = async (req, res) => {
    try {
        const surveys = await Survey.find().select('title description');
        res.json(surveys);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
};
//#endregion

//#region deleteSurvey
exports.deleteSurvey = async (req, res) => {

    try {
        await Survey.findByIdAndDelete(req.body.id);
        res.json({msg: 'Encuesta eliminada'});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
};
//#endregion