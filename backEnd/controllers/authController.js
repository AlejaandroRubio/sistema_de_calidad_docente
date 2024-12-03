const User = require('../models/user');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcrypt');

//#region Register
exports.register = async (req, res) => {
    const { name, email, password } = req.body; // Extrae los datos de registro del cuerpo de la solicitud.

    try {
        // Verifica si ya existe un usuario con el mismo correo electrónico.
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Crea un nuevo usuario con los datos proporcionados.
        user = new User({name,email,password});
        await user.save(); // Guarda el usuario en la base de datos.

        // Crea un token de autenticación con los datos del usuario.
        const payload = {userId: user.id, name: user.name, email: user.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h' // Configura la expiración del token a 1 hora.
        });

        res.json({token}); // Devuelve el token al cliente.
    }catch (error) {
        console.error(error); // Muestra cualquier error en la consola.
        res.status(500).json({msg: 'Hubo un error'}); // Responde con un mensaje de error genérico.
    }
};
//#endregion

//#region Login
exports.login = async (req, res) => {
    const { email, password } = req.body; // Extrae el correo y la contraseña del cuerpo de la solicitud.

    try {
        // Busca al usuario por correo electrónico.
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // Verifica si la contraseña proporcionada coincide con la almacenada.
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        // Genera un token de autenticación.
        const payload = {userId: user.id, name: user.name, email: user.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({token}); // Devuelve el token al cliente.
    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
//#endregion

//#region Delete User
exports.deleteUser = async (req, res) => {
    
    try {
        // Elimina al usuario utilizando el ID extraído del token del cliente.
        await User.findByIdAndDelete(req.user.userId);
        res.json({msg: 'Usuario eliminado'}); // Responde con un mensaje de éxito.
    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
//#endregion

//#region Update User
exports.updateUser = async (req, res) => {
    const { name, email, password } = req.body; // Extrae los datos de la solicitud.

    try {
        // Busca al usuario por su ID.
        let user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // Actualiza los datos del usuario.
        user.name = name;
        user.email = email;
        user.password = EncryptPassword(password); // Encripta la nueva contraseña.

        await user.save(); // Guarda los cambios en la base de datos.

        res.json({msg: 'Usuario actualizado'}); // Responde con un mensaje de éxito.

    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
//#endregion

//#region Get User
exports.findUserById = async (req, res) => {
    try {
        // Busca al usuario por ID y selecciona solo el nombre.
        const user = await User.findById(req.params.id).select('name -_id');
        res.json(user); // Devuelve la información del usuario.
    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}

exports.findUserByEmail = async (req, res) => {
    const { email } = req.query; // Extrae el email de los parámetros de consulta.

    try {
        // Busca al usuario cuyo correo coincida parcial o totalmente (insensible a mayúsculas/minúsculas).
        const user = await User.findOne({email: { $regex: email, $options: 'i' }}).select('name -_id');
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
//#endregion

function EncryptPassword(password) {
    const salt = bcrypt.genSaltSync(10); // Genera un salt para la encriptación.
    return bcrypt.hashSync(password, salt); // Encripta la contraseña utilizando el salt.
}
