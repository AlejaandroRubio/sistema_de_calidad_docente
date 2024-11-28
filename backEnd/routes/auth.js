const express = require('express');
const router = express.Router();
const { register, login, deleteUser, updateUser, findUserById} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { find } = require('../models/user');


router.post('/register', register);
router.post('/login', login);
router.delete('/delete', protect, deleteUser);
router.put('/update', protect, updateUser);
router.get('/user/:id',protect, findUserById);

module.exports = router;