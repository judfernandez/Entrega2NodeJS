const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IOSchema = new Schema({
    _id : {type:mongoose.Types.ObjectId},
    type:String,
    elements:[Object]
});

const ios = mongoose.model('IOs', IOSchema);

module.exports = ios; 