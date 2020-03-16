const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialsSchema = new Schema({
    description: String,
    astm_prefix: String,
    _id: {type:mongoose.Types.ObjectId},
});

const materials = mongoose.model('Materials', materialsSchema);

module.exports = materials; 