const hbs = require('hbs');
const fs = require('fs');

hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3) => {
    return (nota1 + nota2 + nota3) / 3
});

hbs.registerHelper('registrarCurso', (id, nombre_curso, descripcion, modalidad, valor, intensidad, estado) => {
    listaCursos = require('./cursos.json');
    let duplicado = listaCursos.find(ver => ver.id == id);

    let texto;
    let curso;

    if (!duplicado) {
        curso = {
            "nombre_curso": nombre_curso,
            "id": id,
            "descripcion": descripcion,
            "valor": valor,
            "modalidad": modalidad,
            "intensidad": intensidad,
            "estado": estado
        };
        listaCursos.push(curso);
        let datos = JSON.stringify(listaCursos);
        fs.writeFile('./src/cursos.json', datos, (err) => {
            if (err) throw (err);
            console.log('Curso registrado exitosamente');
        });
        texto = "Curso " + curso.nombre_curso + " registrado exitosamente."
    } else {
        texto = "El curso ya existe."
    }

    return texto;

});

hbs.registerHelper('inscribir', (cedula, id) => {
    let texto;
    let matricula;
    listaMatricula = require('./matricula.json');
    let duplicado = listaMatricula.find(ver => ver.cedula == cedula && ver.id == id);

    if (!duplicado) {
        matricula = {
            cedula: cedula,
            id: id
        }

        listaMatricula.push(matricula);
        let datos = JSON.stringify(listaMatricula);
        fs.writeFile('./src/matricula.json', datos, (err) => {
            if (err) throw (err);
            console.log('Matricula registrada exitosamente');
        });
        texto = 'Matricula registrada'
    } else {
        texto = 'Ya se encuentra matriculado en este curso'
    }
    return texto;

});

hbs.registerHelper('listar', (nombre, cedula, correo, telefono) => {
    listaUsuarios = require('./usuarios.json');
    let duplicado = listaUsuarios.find(ver => ver.cedula == cedula);

    let texto;
    let usuario;

    if (!duplicado) {
        usuario = {
            "cedula": cedula,
            "nombre": nombre,
            "correo": correo,
            "telefono": telefono,
            "tipo": "aspirante"
        };
        listaUsuarios.push(usuario);
        let datos = JSON.stringify(listaUsuarios);
        fs.writeFile('./src/usuarios.json', datos, (err) => {
            if (err) throw (err);
            console.log('Usuario registrado exitosamente');
        });
    } else {
        usuario = {
            "cedula": duplicado.cedula,
            "nombre": duplicado.nombre,
            "correo": duplicado.correo,
            "telefono": duplicado.telefono,
            "tipo": duplicado.tipo
        }
        console.log('si existe la wea');
    }

    console.log(usuario);

    if (usuario.tipo == 'coordinador') {

        listaCursos = require('./cursos.json');
        texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>ID:</th>\
                <th>NOMBRE:</th>\
                <th>DESCRIPCION:</th>\
                <th>VALOR:</th>\
                <th>MODALIDAD:</th>\
                <th>INTENSIDAD:</th>\
                <th>ESTADO:</th>\
                </thead>\
                <tbody>";

        listaCursos.forEach(cursos => {
            texto = (texto +
                "<tr class='table-info text-center'>" +
                '<td>' + cursos.id + '</td>' +
                '<td>' + cursos.nombre_curso + '</td>' +
                '<td>' + cursos.descripcion + '</td>' +
                '<td>' + cursos.valor + '</td>' +
                '<td>' + cursos.modalidad + '</td>' +
                '<td>' + cursos.intensidad + '</td>' +
                '<td>' + cursos.estado + '</td>' +
                '</tr>');
        })
        texto = (texto + "</tbody></table><form action='/coordinador' method='get'><button class='btn btn-dark'>REGISTRAR O BORRAR</button></form><br></div>");
    } else {
        listaCursos = require('./cursos.json');
        texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>ID:</th>\
                <th>NOMBRE:</th>\
                <th>DESCRIPCION:</th>\
                <th>VALOR:</th>\
                <th>MODALIDAD:</th>\
                <th>INTENSIDAD:</th>\
                <th>INSCRIBIRSE:</th>\
                </thead>\
                <tbody>";

        listaCursos.forEach(cursos => {
            if (cursos.estado == 'disponible') {
                texto = (texto +
                    "<tr class='table-info text-center'>" +
                    '<td>' + cursos.id + '</td>' +
                    '<td>' + cursos.nombre_curso + '</td>' +
                    '<td>' + cursos.descripcion + '</td>' +
                    '<td>' + cursos.valor + '</td>' +
                    '<td>' + cursos.modalidad + '</td>' +
                    '<td>' + cursos.intensidad + '</td>' +
                    '<td><form action="/inscrito?cedula=' + usuario.cedula + '&id=' + cursos.id + ' " method="post"><button class="btn btn-dark">INSCRIBIR</button></form></td>' +
                    '</tr>');
            }
        })
        texto = (texto + "</tbody></table></div>");

    }
    return texto;
})