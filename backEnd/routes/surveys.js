const express = require('express');
const router = express.Router();
const { createSurvey, getSurveysSummarized, deleteSurvey,getSurveysById, getSurveysByTitle} = require('../controllers/surveyController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create',protect, createSurvey);
router.get('/', protect, getSurveysSummarized);
router.get('/:id', protect, getSurveysById);
router.get('/search/by-title', protect, getSurveysByTitle);
router.delete('/delete/:id', protect, deleteSurvey);

module.exports = router;    
