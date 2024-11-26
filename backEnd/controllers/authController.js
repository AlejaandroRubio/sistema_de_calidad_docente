const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        user = new User({name,email,password});
        await user.save();

        const payload = {userId: user.id};

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({token});
    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
};

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

        const payload = {userId: user.id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({token});
    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}