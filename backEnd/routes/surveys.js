const express = require('express');
const router = express.Router();
const { createSurvey, getSurveyssummarized, deleteSurvey} = require('../controllers/surveyController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create',protect, createSurvey);
router.get('/', protect, getSurveyssummarized);
router.delete('/delete', protect, deleteSurvey);

module.exports = router;    
