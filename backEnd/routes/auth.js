const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    deleteUser, 
    updateUser, 
    findUserById, 
    findUserByEmail
} = require('../controllers/authController');
const { protect, verifyToken } = require('../middlewares/authMiddleware');
const { find } = require('../models/user');

// Rutas relacionadas con la autenticación y la gestión de usuarios.
router.post('/register', register); // Ruta para registrar un nuevo usuario.
router.post('/login', login); // Ruta para iniciar sesión y obtener un token

router.delete('/delete', protect, deleteUser); // Ruta protegida para eliminar la cuenta del usuario autenticado.
router.put('/update', protect, updateUser); // Ruta protegida para actualizar los datos del usuario autenticado.

router.get('/user/:id', protect, findUserById); // Ruta protegida para obtener los datos de un usuario por su ID.
router.get('/user/search/email', findUserByEmail); // Ruta para buscar un usuario por su email (sin protección).

router.get('/verify-Token', verifyToken); // Ruta para verificar si un token es válido.

module.exports = router;