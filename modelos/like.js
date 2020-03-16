const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    objid:{type:mongoose.Types.ObjectId},
    type: Number,
    execid:{type:mongoose.Types.ObjectId},
    userid:{type:mongoose.Types.ObjectId}
});

const like = mongoose.model('Like', likeSchema);

module.exports = like; 