const express = require('express');
const router = express.Router();
const { register, login, deleteUser, updateUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.delete('/delete', protect, deleteUser);
router.patch('/update', protect, updateUser);

module.exports = router;