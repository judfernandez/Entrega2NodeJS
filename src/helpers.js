const hbs = require('hbs');
const fs = require('fs');

hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3) => {
    return (nota1 + nota2 + nota3) / 3
});

hbs.registerHelper('actualizar', (cedula, nombre, correo, telefono, tipo) => {
    listaUsuarios = require('./usuarios.json');
    console.log(cedula);
    let busqueda = listaUsuarios.find(ver => ver.cedula == cedula);
    console.log(busqueda);
    if (busqueda) {
        let usuario = {
            nombre: nombre,
            cedula: busqueda.cedula,
            correo: correo,
            telefono: telefono,
            tipo: tipo
        }

        listaUsuarios.splice(listaUsuarios.indexOf(busqueda));
        listaUsuarios.push(usuario);
        console.log(listaUsuarios);

        let datos = JSON.stringify(listaUsuarios);
        fs.writeFile('./src/usuarios.json', datos, (err) => {
            if (err) throw (err);
            console.log('Archivo guardado con exito');
        });

        return "El usuario se modifico exitosamente"
    } else {
        return "El usuario que ingreso no existe en la base de datos"
    }

});

hbs.registerHelper('desmatricular', (cedula, id) => {
    let texto;
    listaMatricula = require('./matricula.json');
    let busqueda = listaMatricula.find(ver => ver.id == id && ver.cedula == cedula);
    if (!busqueda) {
        return "El estudiante no esta matriculado en ese curso"
    } else {
        listaMatricula.splice(listaMatricula.indexOf(busqueda), 1);

        let datos = JSON.stringify(listaMatricula);
        let matriculadosCurso = [];
        fs.writeFile('./src/matricula.json', datos, (err) => {
            if (err) throw (err);
            console.log("El archivo fue guardado exitosamente");
        })

        listaUsuarios = require('./usuarios.json');
        let listaCedulas = listaMatricula.filter(ver => ver.id == id);

        console.log(listaCedulas);

        listaCedulas.forEach(ver => {
            let encontrado = listaUsuarios.find(usr => usr.cedula == ver.cedula);
            matriculadosCurso.push(encontrado);
        });

        console.log(matriculadosCurso);

        texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>CEDULA:</th>\
                <th>NOMBRE:</th>\
                <th>CORREO:</th>\
                <th>TELEFONO:</th>\
                </thead>\
                <tbody>";

        matriculadosCurso.forEach(cursos => {
            let user = listaUsuarios.find(ver => ver.cedula == cursos.cedula);
            console.log(user);
            texto = (texto +
                "<tr class='table-info text-center'>" +
                '<td>' + user.cedula + '</td>' +
                '<td>' + user.nombre + '</td>' +
                '<td>' + user.correo + '</td>' +
                '<td>' + user.telefono + '</td>' +
                '</tr>');

        })
        texto = (texto + "</tbody></table><br></div>");

        return texto
    }
});

hbs.registerHelper('cerrar', (id) => {
    listaCursos = require('./cursos.json');
    let busqueda = listaCursos.find(ver => ver.id == id);
    let curso = {
        nombre_curso: busqueda.nombre_curso,
        id: id,
        descripcion: busqueda.descripcion,
        valor: busqueda.valor,
        modalidad: busqueda.modalidad,
        intensidad: busqueda.intensidad,
        estado: 'cerrado'
    }

    listaCursos.splice(listaCursos.indexOf(busqueda));
    listaCursos.push(curso);

    let datos = JSON.stringify(listaCursos);
    fs.writeFile('./src/cursos.json', datos, (err) => {
        if (err) throw (err);
        console.log('Archivo guardado con exito');
    });

    return "El curso se cerro exitosamente"
});

hbs.registerHelper('eliminarCurso', (cedula, id) => {
    listaCursos = require('./cursos.json');
    listaMatricula = require('./matricula.json');
    let matriculado = listaMatricula.filter(ver => ver.cedula == cedula);
    let cursosMatriculados = [];
    let texto;

    if (id) {
        console.log('un id perron = ' + id);
        let temporal = listaMatricula.filter(ver => ver.id != id && ver.cedula == cedula);
        matriculado = temporal.slice();
        console.log(matriculado);
        listaMatricula.filter(ver => ver.cedula != cedula).forEach(iter => {
            temporal.push(iter);
        });

        console.log(temporal);
        let datos = JSON.stringify(temporal);
        fs.writeFile('./src/matricula.json', datos, (err) => {
            if (err) throw (err);
            console.log('Archivo guardado con exito');
        });
    }
    console.log(matriculado);

    matriculado.forEach(szs => {
        encontrado = listaCursos.find(cur => cur.id == szs.id);
        cursosMatriculados.push(encontrado);
    });

    console.log(matriculado);
    console.log(cursosMatriculados);

    texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>ID:</th>\
                <th>NOMBRE:</th>\
                <th>DESCRIPCION:</th>\
                <th>VALOR:</th>\
                <th>MAS INFORMACION:</th>\
                <th>DARSE DE BAJA:</th>\
                </thead>\
                <tbody>";

    cursosMatriculados.forEach(cursos => {
        texto = (texto +
            "<tr class='table-info text-center'>" +
            '<td>' + cursos.id + '</td>' +
            '<td>' + cursos.nombre_curso + '</td>' +
            '<td>' + cursos.descripcion + '</td>' +
            '<td>' + cursos.valor + '</td>' +
            '<td><div class="accordion" id="accordionExample"></div>' +
            '<div class="card">' +
            '<div class="card-header" id="headingOne">' +
            '<h5 class="mb-0">' +
            '<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">' +
            "Detalles" +
            '</button></h5></div>' +
            '<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">' +
            '<div class="card-body">' +
            "Modalidad: " + cursos.modalidad + '<br>Intensidad: ' + cursos.intensidad +
            '</div></div></div></div></td>' + '<td><form action="/aspirante?cedula=' + cedula + '&id=' + cursos.id + ' " method="post"><button class="btn btn-dark">DARSE DE BAJA</button></form></td>' +
            '</tr>');
    })
    texto = (texto + "</tbody></table></div>");
    return texto
})

//no se necesita mas
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

        if (curso.modalidad == null) {
            curso.modalidad = 'No especificada'
        }

        if (curso.intensidad == null) {
            curso.intensidad = 'No especificada'
        }

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
//no se necesita mas
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

hbs.registerHelper('listar2', () => {
    let texto;
    listaCursos = require('./cursos.json');
    listaMatricula = require('./matricula.json');
    listaUsuarios = require('./usuarios.json');
    texto = "<div class='table-responsive'> <table class='table table-hover'>\
            <thead class='thead-dark text-center'>\
            <th>ID:</th>\
            <th>NOMBRE:</th>\
            <th>DESCRIPCION:</th>\
            <th>VALOR:</th>\
            <th>ESTUDIANTES:</th>\
            <th>CERRAR CURSO:</th>\
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
                '<td><div class="accordion" id="accordionExample"></div>' +
                '<div class="card">' +
                '<div class="card-header" id="headingOne">' +
                '<h5 class="mb-0">' +
                '<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">' +
                "Detalles" +
                '</button></h5></div>' +
                '<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">' +
                '<div class="card-body">' +
                "Personas inscritas: " + listaMatricula.filter(ver => ver.id == cursos.id).length +
                '</div></div></div></div></td>' +
                '<td><form action="/cerrado?id=' + cursos.id + ' " method="post"><button class="btn btn-dark">CERRAR</button></form></td>' +
                '</tr>');
        }
    })
    texto = (texto + "</tbody></table></div>");

    return texto;
});

hbs.registerHelper('listar', (usuario, listaCursos) => {

    let texto;

    if (usuario.tipo == 'coordinador') {

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
        texto = (texto + "</tbody></table><form action='/coordinador' method='get'><button class='btn btn-dark'>REGISTRAR CURSO</button></form><br>" +
            "<form action='/coordinador2' method='get'><button class='btn btn-dark'>CERRAR CURSO</button></form><br>" +
            "<form action='/coordinador3' method='get'><button class='btn btn-dark'>DESMATRICULAR ESTUDIANTE</button></form><br>" +
            "<form action='/coordinador4' method='get'><button class='btn btn-dark'>MODIFICAR USUARIOS</button></form><br></div><br></div>");
    } else {

        texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>ID:</th>\
                <th>NOMBRE:</th>\
                <th>DESCRIPCION:</th>\
                <th>VALOR:</th>\
                <th>MAS INFORMACION:</th>\
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
                    '<td><div class="accordion" id="accordionExample"></div>' +
                    '<div class="card">' +
                    '<div class="card-header" id="headingOne">' +
                    '<h5 class="mb-0">' +
                    '<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">' +
                    "Detalles" +
                    '</button></h5></div>' +
                    '<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">' +
                    '<div class="card-body">' +
                    "Modalidad: " + cursos.modalidad + '<br>Intensidad: ' + cursos.intensidad +
                    '</div></div></div></div></td>' +
                    '<td><form action="/inscrito?cedula=' + usuario.cedula + '&id=' + cursos.id + ' " method="post"><button class="btn btn-dark">INSCRIBIR</button></form></td>' +
                    '</tr>');
            }
        })
        texto = (texto + "</tbody></table><form action='/aspirante?cedula=" + usuario.cedula + "' method='post'><button class='btn btn-dark'>DARME DE BAJA EN UN CURSO</button></form><br></div>");

    }
    return texto;
})