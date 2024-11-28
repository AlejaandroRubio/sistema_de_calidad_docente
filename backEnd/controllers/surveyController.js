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
exports.getSurveysSummarized = async (req, res) => {
    try {
        const surveys = await Survey.find().select('title description');
        res.json(surveys);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
};

exports.getSurveysById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ msg: 'Encuesta no encontrada' });
    }
    res.json(survey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Hubo un error' });
  }
};

exports.getSurveysByTitle = async (req, res) => {
    
    try {
        const { title } = req.query;
    
        // Validar que el título sea proporcionado
        if (!title) {
          return res.status(400).json({ msg: 'El título es requerido' });
        }
    
        // Realizar la búsqueda por título
        const surveys = await Survey.find({ title: { $regex: title, $options: 'i' } }).select('_id title description user');
    
        res.json(surveys);
      } catch (error) {
        console.error('Error al obtener encuestas:', error);
        res.status(500).json({ msg: 'Hubo un error' });
      }
    };
  
//#endregion

//#region deleteSurvey
exports.deleteSurvey = async (req, res) => {

    try {
        await Survey.findByIdAndDelete(req.params.id);
        res.json({msg: 'Encuesta eliminada'});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
};
//#endregion