const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const dirNode_modules = path.join(__dirname, '../node_modules')

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

app.get('/coordinador', (req, res) => {
    res.render('coordinador');
});

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
    res.render('index', {
        cedula: parseInt(req.body.cedula),
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: parseInt(req.body.telefono)
    });

});

app.post('/calculos', (req, res) => {
    console.log(req.query);
    res.render('calculos', {
        estudiante: req.body.nombre,
        nota1: parseInt(req.body.nota1),
        nota2: parseInt(req.body.nota2),
        nota3: parseInt(req.body.nota3)
    });

});

app.get('/', (req, res) => {
    res.render('login', {
    })
})


app.get('*', (req, res) => {
    res.render('error');
});

console.log(__dirname)

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});