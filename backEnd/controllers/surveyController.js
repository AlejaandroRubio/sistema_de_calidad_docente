const Survey = require('../models/Survey');

//#region createSurvey
exports.createSurvey = async (req, res) => {
    const { title, description ,questions } = req.body; // Extrae los datos de la encuesta del cuerpo de la solicitud.
    const {userId} = req.user; // Obtiene el ID del usuario autenticado.

    try{
      // Crea un nuevo documento de encuesta con los datos proporcionados.
        const newSurvey = new Survey({
            title,
            description,
            questions,
            user: userId // Asocia la encuesta al usuario que la creó.
            
        });

        await newSurvey.save(); // Guarda la encuesta en la base de datos.
        res.status(201).json(newSurvey);  // Devuelve la encuesta recién creada con un código 201 (creado).
    } catch (error) {
        console.error(error);// Muestra cualquier error en la consola.
        res.status(500).json({msg: 'Hubo un error'});// Responde con un mensaje de error genérico.
    }
};
//#endregion

//#region getSurveys
exports.getSurveysSummarized = async (req, res) => {
     try {
        // Obtiene una lista de encuestas con solo los campos título y descripción.
        const surveys = await Survey.find().select('title description');
        res.json(surveys); // Devuelve las encuestas resumidas.
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

exports.getSurveysById = async (req, res) => {
  try {
      // Busca una encuesta por su ID.
      const survey = await Survey.findById(req.params.id);
      if (!survey) {
        return res.status(404).json({ msg: 'Encuesta no encontrada' });
      }
      res.json(survey); // Devuelve la encuesta encontrada.
    }catch (error) {
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

        // Busca encuestas cuyo título coincida parcial o totalmente (insensible a mayúsculas/minúsculas).
        const surveys = await Survey.find({ title: { $regex: title, $options: 'i' } }).select('_id title description user');
    
        res.json(surveys); // Devuelve las encuestas encontradas.
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
        res.json({msg: 'Encuesta eliminada'}); // Devuelve un mensaje de éxito.
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'}); // Devuelve un mensaje de error genérico.
    }
};
//#endregion