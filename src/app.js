const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const dirNode_modules = path.join(__dirname, '../node_modules');
const mongoose = require('mongoose');
const Usuario = require('./../modelos/usuario');
const Curso = require('./../modelos/curso');
var listaCursos;

mongoose.connect('mongodb://localhost:27017/nodedb', { useNewUrlParser: true }, (err) => {
    if (err) {
        return console.log("Fallo la conexion con la BD" + (err));
    }
    return console.log("Conexion con la BD exitosamente");
});

actualizarCursos()

function actualizarCursos() {
    Curso.find({}).exec((err, res) => {
        if (err) {
            return console.log(err);
        }
        else {
            listaCursos = res;
            console.log('se obtuvieron los cursos');
            console.log(listaCursos.length);
        }
    })
}
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
require('./helpers');

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');

app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

app.post('/inscrito', (req, res) => {
    console.log();
    res.render('inscrito', {
        cedula: parseInt(req.query.cedula),
        id: (req.query.id)
    })
});

app.post('/aspirante', (req, res) => {
    res.render('aspirante', {
        cedula: req.query.cedula,
        id: req.query.id
    });
});

app.post('/desmatricular', (req, res) => {
    res.render('desmatricular', {
        cedula: req.body.cedula,
        id: req.body.id
    });
});

app.get('/coordinador', (req, res) => {
    res.render('coordinador');
});

app.get('/coordinador2', (req, res) => {
    res.render('coordinador2');
})

app.get('/coordinador3', (req, res) => {
    res.render('coordinador3');
})

app.get('/coordinador4', (req, res) => {
    res.render('coordinador4');
})

app.post('/actualizardatos', (req, res) => {
    res.render('actualizardatos', {
        cedula: parseInt(req.body.cedula),
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: parseInt(req.body.telefono),
        tipo: req.body.tipo
    });
})

app.post('/cerrado', (req, res) => {
    res.render('cerrado', {
        id: req.query.id
    });
})

app.post('/cursoregistrado', (req, res) => {
    console.log(req.body)
    res.render('cursoregistrado', {
        nombre_curso: req.body.nombre_curso,
        id: (req.body.id),
        descripcion: req.body.descripcion,
        valor: parseInt(req.body.valor),
        modalidad: req.body.modalidad,
        intensidad: parseInt(req.body.intensidad),
        estado: req.body.estado,
    });
});

app.post('/index', (req, res) => {

    Usuario.findOne({ cedula: parseInt(req.body.cedula) }).exec((err, response) => {
        if (err) {
            return console.log(err);
        }
        else {
            if (!response) {
                console.log('noresponse');
                res.render('login', {
                    texto: 'Credenciales Incorrectas'
                })
            }
            else {
                if (response.password == req.body.password) {
                    console.log(response)
                    res.render('index', {
                        nombre: response.nombre,
                        usuario: response,
                        listaCursos: listaCursos
                    })
                }
                else {
                    console.log('wrongpass')
                    res.render('login', {
                        texto: 'Credenciales Incorrectas'
                    })
                }
            }
        }
    })



});

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/registrado', (req, resRender) => {

    let usuario;
    Usuario.findOne({ cedula: parseInt(req.body.cedula) }).exec((err, res) => {
        if (err) {
            return console.log(err)
        }
        else {
            if (res) {
                resRender.render('registrado', {
                    texto: 'El usuario ya se encuentra registrado.'
                });
            }
            else {
                usuario = new Usuario({
                    cedula: parseInt(req.body.cedula),
                    nombre: req.body.nombre,
                    password: req.body.password,
                    correo: req.body.correo,
                    telefono: parseInt(req.body.telefono),
                    tipo: 'aspirante'
                })
                usuario.save((err, res) => {
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        console.log(res);
                        resRender.render('login');
                    }
                })
            }
        }
    })
})

app.get('/register', (req, res) => {
    res.render("register")
})

app.get('/', (req, res) => {
    res.render('home')
})


app.get('*', (req, res) => {
    res.render('error');
});

console.log(__dirname)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Servidor en el puerto ' + port);
})