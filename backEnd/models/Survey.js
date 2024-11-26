const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    questions: [
        {
            tipo: {
                type: String,
                enum: ['text', 'opcionM', 'siNo'],
                required: true
            },
            pregunta: {
                type: String,
                required: true
            },
            opciones: [String]
        },
    ],
    /*
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    */
});

module.exports = mongoose.model('Survey', surveySchema);