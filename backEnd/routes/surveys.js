const express = require('express');
const router = express.Router();
const { 
    createSurvey, 
    getSurveysSummarized, 
    deleteSurvey, 
    getSurveysById, 
    getSurveysByTitle
} = require('../controllers/surveyController');
const { protect } = require('../middlewares/authMiddleware');

// Ruta para obtener un resumen de todas las encuestas (protegida).
router.get('/', protect, getSurveysSummarized);

// Ruta para crear una encuesta (protegida, solo accesible para usuarios autenticados).
router.post('/create', protect, createSurvey);

// Ruta para obtener una encuesta específica por su ID (protegida).
router.get('/:id', protect, getSurveysById);

// Ruta para buscar encuestas por su título (protegida).
router.get('/search/by-title', protect, getSurveysByTitle);

// Ruta para eliminar una encuesta específica por su ID (protegida).
router.delete('/delete/:id', protect, deleteSurvey);

module.exports = router;    
