const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matriculaSchema = new Schema({
    cedula: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }
});

const Matricula = mongoose.model('Matricula', matriculaSchema);

module.exports = Matricula; 