const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
<<<<<<< HEAD
const mongoose = require('mongoose');
const Usuario = require('./../modelos/usuario');
const Curso = require('./../modelos/curso');
const Matricula = require('./../modelos/matricula');
const session = require('express-session');
const dirNode_modules = path.join(__dirname, '../node_modules');
=======
const dirNode_modules = path.join(__dirname, '../node_modules')

>>>>>>> parent of 4eca3d3... Progreso

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

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

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

<<<<<<< HEAD
app.post('/indexlogin', (req, res) => {
    let busqueda = {
        cedula: req.body.cedula,
        password: req.body.password
    }

    Usuario.findOne({ cedula: busqueda.cedula, password: busqueda.password }, (err, resultado) => {
        console.log('cedula: ' + busqueda.cedula);
        console.log('password: ' + busqueda.password);

        if (err) {
            return console.log(err)
        }

        if (!resultado) {
            console.log("Cedula o contraseña incorrectos");
            return res.render('login', {
                texto: "Cedula o contraseña incorrectos, ingreselos nuevamente"
            });

        } else {
            req.session.usuario = resultado;
            console.log('Funca el sizas del ID ' + req.session.usuario._id);

            return res.render('indexlogin', {
                nombre: req.session.usuario.nombre,
                usuario: req.session.usuario,
                rol: req.session.usuario.tipo
            });
        }

    })
})
=======
app.post('/index', (req, res) => {
    res.render('index', {
        cedula: parseInt(req.body.cedula),
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: parseInt(req.body.telefono)
    });
>>>>>>> parent of 4eca3d3... Progreso

app.post('/index', (req, res) => {
    let usuario;
    Usuario.findOne({ cedula: parseInt(req.body.cedula) }).exec((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log(res)
        if (!res) {
            usuario = new Usuario({
                cedula: req.body.cedula,
                nombre: req.body.nombre,
                password: req.body.password,
                correo: req.body.correo,
                telefono: req.body.telefono,
                tipo: 'aspirante'
            });
            usuario.save((err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log('guardado' + res);
            });
        } else {
            usuario = new Usuario({
                "cedula": res.cedula,
                "nombre": res.nombre,
                "pasword": res.password,
                "correo": res.correo,
                "telefono": res.telefono,
                "tipo": res.tipo
            })
        }
    });
    setTimeout(function () {
        res.render('index', {
            usuario: usuario
        });
    }, 3000);
});

app.get('/', (req, res) => {
<<<<<<< HEAD
    res.render('home');
})

app.get('/register', (req, res) => {
    res.render('registro');
})

app.get('/login', (req, res) => {
    res.render('login', {
        texto: "Ingrese su cedula y su contraseña"
    });
})

app.get('/test', (req, res) => {
    res.render('test', {
        cedula: 111,
        id: "02"
=======
    res.render('login', {
>>>>>>> parent of 4eca3d3... Progreso
    })
})


app.get('*', (req, res) => {
    res.render('error');
});

console.log(__dirname)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Servidor en el puerto ' + port);
})