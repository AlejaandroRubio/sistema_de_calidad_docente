const User = require('../models/user');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcrypt');

//#region Register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        user = new User({name,email,password});
        await user.save();

        const payload = {userId: user.id, name: user.name, email: user.email};

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({token});
    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
};
//#endregion

//#region Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        const payload = {userId: user.id, name: user.name, email: user.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({token});
    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
//#endregion

//#region Delete User
exports.deleteUser = async (req, res) => {
    
    try {
        await User.findByIdAndDelete(req.user.userId);
        res.json({msg: 'Usuario eliminado'});
    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
//#endregion

//#region Update User
exports.updateUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        user.name = name;
        user.email = email;
        user.password = EncryptPassword(password);

        await user.save();

        res.json({msg: 'Usuario actualizado'});

    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
//#endregion

//#region Get User
exports.findUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name');
        res.json(user);
    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
//#endregion


function EncryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}
