const express = require('express');
const router = express.Router();
const { createSurvey, getSurveys,} = require('../controllers/surveyController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create',protect, createSurvey);
router.get('/', protect, getSurveys);

module.exports = router;    
