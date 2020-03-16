const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testsc = new Schema({
    _id: {type:mongoose.Types.ObjectId},
    date: Date
});

const test = mongoose.model('test', testsc);

module.exports = test; 