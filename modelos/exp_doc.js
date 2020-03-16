const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expDocSchema = new Schema({
    _id: {type:mongoose.Types.ObjectId},
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    test_location: {
        type: String,
        required: true
    },
    analyzed_properties: [{
        type: String,
        required: true
    }],
    knowledge_domains: [{
        type: String,
        required: true
    }],
    materials: [{
        description: {type: String, required:true},
        astm_prefix: {type: String, required:true},
        _id: {type:mongoose.Types.ObjectId}
    }],
    keywords: [{
        type:String,
        required: true
    }],
    version: {
        type: Number,
        required: true
    },
    output_description: {
        type:String,
        required:true
    },
    purposes: [{
        type:String,
        required: true
    }],
    authors: [{
        role: {type:String, required:true},
        author_id: {type:mongoose.Types.ObjectId}
    }],
    document_section: [{
        type: {type:String,required:true},
        corpus: [{type:String, rquired:true}],
        _id: {type:mongoose.Types.ObjectId}
    }],
    method: [{
        type:String,
        required:true
    }],
    techniques: [{
        type:String,
        required:true
    }],
    date: {
        type:Date,
        required:true
    },
    institution: [{
        institution_id: {type:mongoose.Types.ObjectId}
    }],
    project: [{
        project_id: {type:mongoose.Types.ObjectId}
    }]
});

const exp_doc = mongoose.model('Exp_doc', expDocSchema);

module.exports = exp_doc; 