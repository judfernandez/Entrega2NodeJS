require('./config');
const express = require('express');
const app = express();
const path = require('path');
const session = require('client-sessions');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const dirNode_modules = path.join(__dirname, '../node_modules');
const mongoose = require('mongoose');
const ExpDoc = require('./../modelos/exp_doc');
const Materials = require('./../modelos/materials');
const Execution = require('./../modelos/execution');
const Social = require('./../modelos/social');
const Like = require('./../modelos/like');
const IOs = require('./../modelos/ios');
const fs = require('fs');
// const {spawn} = require('child_process');
// const spawn = require('child_process').spawn;
var {PythonShell} = require('python-shell');
const ObjectId = mongoose.Types.ObjectId;

function testPromise(argument){
    return new Promise((resolve,reject)=>{
        let options = {
            pythonPath: 'python',
            args: argument
        }
        var pyshell = new PythonShell('src/install.py',options);
        var error =false;
        if(!error){
            pyshell.on('message',function(message){
                message = JSON.parse(message.replace(/\'/g,'"'));
                resolve(message);
        });
        }
        else{
            reject('rejected');
        }
    });
}

// let pyPromise = new Promise((resolve,reject) => {
//     var pyshell = new PythonShell('src/test.py');
//     let thing = '';
//     pyshell.on('message',function(message){
//         thing = message;
//     });
//     const error = false;
//     if(!error){
//         resolve(thing);
//     }
//     else{
//         reject('Error');
//     }
// });


// let runPy = new Promise(function(success,unsuccess){
    
//     const pyprog = spawn('python',['test.py']);

//     pyprog.stdout.on('data',function(data){
//         success(data);
//     });
//     pyprog.stderr.on('data',(data)=>{
//         unsuccess(data);
//     });
// });

// var pyshell = new PythonShell('src/test.py');

// async function fromPy(){
//     await pyshell.on('message',function(message){
//         console.log(message);
//     });
// }

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err) => {
    if (err) {
        return console.log("Fallo la conexion con la BD" + (err));
    }
    else{
        return console.log("Conexion con la BD exitosamente");
        
    }
    
});


app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
require('./helpers');

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');
const jsondir = path.join(__dirname, '../json');


ExpDoc.find({}).exec((err,res) =>{
    if(err){
        return console.log(err);
    }
    else if (res.length == 0){let socialjson = JSON.parse(fs.readFileSync(jsondir+'/exp_proto_social.json'));
    socialjson.forEach(function(element){
        element._id = new ObjectId(element._id);
        element.elements.forEach(function(internal){
            internal._id = new ObjectId(internal._id);
            if (internal.id_institution){
                internal.id_institution = new ObjectId(internal.id_institution);
            };
        });
        let newsocial = new Social(element);
        newsocial.save((err, res) => {
            if (err) {
                return console.log(err);
            }
            else {
                // console.log('SOCIAL READ');
            }
        });
    });
    
    let iojson = JSON.parse(fs.readFileSync(jsondir+'/exp_proto_ios.json'));
    iojson.forEach(function(element){
        element._id = new ObjectId(element._id);
        element.elements.forEach(function(internal){
            internal._id = new ObjectId(internal._id);
        });
        let newios = new IOs(element);
        newios.save((err, res) => {
            if (err) {
                return console.log(err);
            }
            else {
                console.log('IO READ');
            }
        });
    });
    
    let execjson = JSON.parse(fs.readFileSync(jsondir+'/exp_proto_exec.json'));
    execjson.forEach(function(element){
        element._id = new ObjectId(element._id);
        element.exp_proto_docu_id = new ObjectId(element.exp_proto_docu_id);
        element.date = new Date(element.date).toISOString();
        
        // if(element.procedures.inputs){element.procedures.inputs.forEach(function(inele){
        //     if(inele.dsets){
        //         inele.dsets.forEach(function(dsetinner){
        //             dsetinner.dataset_id = new ObjectId(dsetinner.dataset_id);
        //         });
        //     }
        //     if(inele.ids){
        //         inele.ids.forEach(function(idinner){
        //             idinner = new ObjectId(idinner)
        //         })
        //     };
        // });};
        // if(element.procedures.outputs){element.procedures.outputs.forEach(function(inele){
        //     if(inele.dsets){
        //         inele.dsets.forEach(function(dsetinner){
        //             dsetinner.dataset_id = new ObjectId(dsetinner.dataset_id);
        //         });
        //     }
        //     if(inele.ids){
        //         inele.ids.forEach(function(idinner){
        //             idinner = new ObjectId(idinner)
        //         })
        //     };
        // });}
    
        
    
        element.procedures._id = new ObjectId(element.procedures._id);
    
        let newexec = new Execution(element);
        newexec.save((err, res) => {
            if (err) {
                return console.log(err);
            }
            else {
                console.log('Exectuions READ');
            }
        });
    });
    
    let expdocjson = JSON.parse(fs.readFileSync(jsondir+'/exp_proto_docu.json'));
    expdocjson.forEach(function(element){
        element._id = new ObjectId(element._id);
        element.materials._id = new ObjectId(element.materials._id);
        element.authors.forEach(function(authorelement){
            authorelement.author_id = new ObjectId(authorelement.author_id );
        });
        element.date = new Date(element.date).toISOString();
        element.document_section.forEach(function(docelement){
            docelement._id = new ObjectId(docelement._id);
        })
        element.institution.forEach(function(inselement){
            inselement.institution_id = new ObjectId(inselement.institution_id);
        });
        element.project.forEach(function(prelement){
            prelement.project_id = new ObjectId(prelement.project_id);
        });
        
        element.materials.forEach(function(mat){
            let newmat = new Materials(mat);
            newmat.save((err, res) => {
                if (err) {
                    return console.log(err);
                }
                else {
                    console.log('MATERIALS IN');
                }
            });
        });
    
        let newexpdoc = new ExpDoc(element);
        newexpdoc.save((err, res) => {
            if (err) {
                return console.log(err);
            }
            else {
                console.log('DOCS IN');
            }
        });
    });
    }
    else{
        console.log('Already read.')
    }
})

app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

app.post('/index', (req, res) => {

        //handle like
        //nest into query
        if(req.body.like){
            Like.find({execid: req.body.id, objid: req.body.likeid, userid: req.session.email, type: req.body.type}).exec((err,reslike)=>{
                if (err){
                    return console.log(err)
                }
                else{
                    console.log(reslike)
                    if(reslike.length == 0){
                        let likeobject = new Like({
                            objid : req.body.likeid,
                            userid : req.session.email,
                            execid: req.body.id,
                            type : req.body.type
                        })
                        likeobject.save((err,response)=>{
                            if(err){
                                return console.log(err)
                            }
                            else{
                                console.log("like saved")
                            }
                        })
                    }
                    else{
                        console.log("already liked")
                    }
                }
            })
        };

        Execution.findOne({_id: req.body.id}).exec((err,rese)=>{
            if(err){
                return console.log(err);
            }
            else{

                ExpDoc.findOne({_id: rese.exp_proto_docu_id}).exec((err,resd)=>{
                    if(err){
                        return console.log(err);
                    }
                    else{

                        IOs.find().exec((err,resio)=>{
                            if(err){
                                console.log(err);
                            }
                            else{

                                Social.find({type : "authors"}).exec((err,resauth)=>{
                                    if(err){
                                        return console.log(err);
                                    }
                                    else{

                                        Social.find({type :  "institutions"}).exec((err,resinst)=>{
                                            if(err){
                                                return console.log(err);
                                            }
                                            else{
                                                Social.find({type : "projects"}).exec((err,resproj)=>{
                                                    if(err){
                                                        return console.log(err);
                                                    }
                                                    else{
                                                        console.log(resproj[0].elements);
                                                        let argument = [req.session.email,'5d99313b80591a1cb40f3231'];
                                                        testPromise(argument).then(function(inside){
                                                        res.render('index', {
                                                            execObject: rese,
                                                            docObject: resd,
                                                            ios: resio,
                                                            auths: resauth[0].elements,
                                                            insts: resinst[0].elements,
                                                            projs: resproj[0].elements,
                                                            recommends: inside       
                                            });

                                                }).catch(err=>console.log(err));
                                                    }
                                                });
                                            }
                                        });

                                        
                                
                                    }
                                    
                        });
                            }
                        });

                        // res.render('index', {
                        //     execObject: rese,
                        //     docObject: resd       
                        // });
                    }
                });

            }
        })

});

app.get('/login', (req, res) => {
    
    Execution.find({}).exec((err,resExec) =>{
        if(err) {
            return console.log(err);
        }
        else {
            ExpDoc.find({}).exec((err,resDoc) =>{
                if(err) {
                    return console.log(err);
                }
                else{
                    let executions = '<form action="/index" method="POST">';
                    let documents = '<form action="/index" method="POST">';

                    resExec.forEach(function (executionitem){
                        executions = executions + 
                        '<input type="radio" name="id" value="' + executionitem._id + '">' +
                        executionitem.date + '<br>';
                    });
                    executions = executions + '<br>' +
                    '<button class="btn btn-dark">SELECT</button></form>';

                    resDoc.forEach(function (docitem){
                        documents = documents +
                        '<input type="radio" name="id" value="' + docitem._id + '">' +
                        docitem.title + '<br>';
                    });

                    documents = documents + '<br>' +
                    '<button class="btn btn-dark">SELECT</button></form>';

                    

                    res.render('login',{
                        executions: executions,
                        documents: documents,
                    })
                }
            })
        }
    })

});

app.get('/', (req, res) => {
    Social.findOne({type:'authors'}).exec((err,rese)=>{
        if(err){
            return console.log(err);
        }
        else{
            req.session.email = rese.elements[0]._id;
            res.render('home');
        }
    })
    
});

app.get('*', (req, res) => {
    res.render('error');
});

app.listen(process.env.PORT, () => {
    console.log('Servidor en el puerto ' + process.env.PORT);
})