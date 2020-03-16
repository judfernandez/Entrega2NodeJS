const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const socialSchema = new Schema({
    _id : {type:mongoose.Types.ObjectId},
    type:String,
    elements:[Object]
});

const social = mongoose.model('Social', socialSchema);

module.exports = social; 