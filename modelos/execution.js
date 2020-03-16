const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const execSchema = new Schema({
    _id: {type:mongoose.Types.ObjectId},
    exp_proto_docu_id: {type:mongoose.Types.ObjectId},
    date: Date,
    procedures:[Object
        // {
        //     name: String,
        //     description: String,
        //     action: String,
        //     type:String,
        //     precedes: {type:mongoose.Types.ObjectId},
        //     inputs: {dsets:[{
        //         dataset_id:{type:mongoose.Types.ObjectId},
        //         dataset_vars:String
        //     }],
        //     ids:[{type:mongoose.Types.ObjectId}]},
        //     outputs: {dsets:[{
        //         dataset_id:{type:mongoose.Types.ObjectId},
        //         dataset_vars:String
        //     }],
        //     ids:[{type:mongoose.Types.ObjectId}]},
        //     _id : {type:mongoose.Types.ObjectId},
        // }
    ]
});

const execution = mongoose.model('Execution', execSchema);

module.exports = execution; 