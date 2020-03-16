const hbs = require('hbs');
const fs = require('fs');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3) => {
    return (nota1 + nota2 + nota3) / 3
});
//nel perro -20
hbs.registerHelper('execlist', (text) => {
    return text;

});

hbs.registerHelper('doclist', (text) => {
    return text;

});

hbs.registerHelper('display', (exec,doc,ios,auths,insts,projs,recommends) => {
    
    res = '<div id="General" class="tabcontent">' +
    '<h3>General</h3>' +
    '<p><b>'+ doc.title+'</b></p>' +
    '<p><b>Time and Date:</b> '+ doc.date+'</p>' +
    '<p><b>Description:</b> '+ doc.description+'</p>' +
    '<p><b>Output Description:</b> ' + doc.output_description + '</p>'+
    '<p><b>Test Location:</b> ' + doc.test_location + '</p>'+
    '<p><b>Analyzed Properties:</b></p>' +
    '<div class="container text-center" style="border-width: 1px;border: solid; border-color: black">'+
    '<ul>';

    doc.analyzed_properties.forEach(prop => {
        res = res + '<li>' + prop + '</li>';
    });

    res = res + '</ul></div>';

    res = res + '<p><b>Keywords:</b></p>' +
    '<div class="container text-center" style="border-width: 1px;border: solid; border-color: black">'+
    '<ul>';

    doc.keywords.forEach(prop => {
        res = res + '<li>' + prop + '</li>';
    });

    res = res + '</ul></div>';

    res = res + '<p><b>Materials:</b></p>' +
    '<div class="container text-center" style="border-width: 1px;border: solid; border-color: black">'+
    '<ul>';

    doc.materials.forEach(mat => {
        res = res + '<li>' + mat.description + '</li>';
    });

    res = res + '</ul></div>';

    res = res + '<p><b>Documentation:</b></p>' +
    '<div class="container text-center" style="border-width: 1px;border: solid; border-color: black">';

    doc.document_section.forEach(mat => {
        res = res + '<p><b>' + mat.type + ':</b></p>' +
        '<ul>';
        mat.corpus.forEach(corp => {
            res = res + '<li>' + corp + '</li>';
        });
        res = res + '</ul>';
    });

    res = res + '</div>';

    res = res + '</div>' +
    '<div id="Procedure" class="tabcontent">' +
    '<h3>Procedures</h3>';

    const specs = ios.find(thing => thing.type == 'specimens');
    const datasets = ios.find(thing => thing.type == 'datasets');
    const matequip = ios.find(thing => thing.type == 'materials & equipments');
    const samples = ios.find(thing => thing.type == 'samples');
    const equations = ios.find(thing => thing.type == 'equations');
    // const specid= [], dsetid= [], mequipid= [],samplesid= [],equationsid = [];
    // specs.elements.forEach(thing => {
    //     specid.push(thing._id);
    // });
    // datasets.elements.forEach(thing => {
    //     dsetid.push(thing._id);
    // });
    // matequip.elements.forEach(thing => {
    //     mequipid.push(thing._id);
    // });
    // samples.elements.forEach(thing => {
    //     samplesid.push(thing._id);
    // });
    // equations.elements.forEach(thing => {
    //     equationsid.push(thing._id);
    // });

    exec.procedures.forEach(procedure =>{
        res = res + '<hr>' +
        '<p>' + procedure.name + 
        '<form action="/index" method="POST">'+
        '<input type="hidden" value="' + exec._id + '" name="id">' +
        '<input type="hidden" value="' + procedure._id + '" name="likeid">' +
        '<input type="hidden" value=1 name="like">' +
        '<input type="hidden" value=2 name="type">' +
        '<button class="btn btn-dark">Like</button><br>' +
        '</form></p>' +
        '<p>Inputs:</p>' +
        '<div class="container text-center" style="border-width: 1px;border: solid; border-color: black">';
        
        var description = '';
        var label = '';
        var found = false;
        var name = '';
        var conditions= '';

        if(procedure.inputs){
        if (procedure.inputs.ids){
            var i = 1;
            procedure.inputs.ids.forEach(input =>{
                // console.log(typeof(input));
                specs.elements.forEach(thing =>{
                    // console.log(typeof(thing._id))
                    if (thing._id == input){
                        description = thing.description;
                        label = 'Label: ' + thing.label;
                        found = true;
                    }
                });

                if(!found){
                    datasets.elements.forEach(thing =>{
                        if(String(thing._id) == input){
                            description = thing.name;
                            label = 'Description: ' + thing.description;
                            found= true;
                        }
                    })
                }
                
                if(!found){
                    matequip.elements.forEach(thing =>{
                        if(thing._id == input){
                            description = thing.name;
                            label = thing.description;
                            found = true;
                        }
                    });
                }

                if(!found){
                    samples.elements.forEach(thing=>{
                        if(thing._id == input){
                            description = thing.description;
                            label = "Label " + thing.label;
                            conditions = 'Conditions: ' + thing.conditions;
                            found = true;
                        }
                    });
                }

                if (!found){
                    equations.elements.forEach(thing=>{
                        if(thing._id == input){
                            description = thing.name;
                            label = 'Latex: ' + thing.latex;
                            found = true;
                        }
                    });
                }

                res = res + '<p>Input ' + i + ': ' + description + '</p>' + 
                '<p>' + name + '</p>' + 
                '<p>' + conditions + '</p>' +
                '<p>' + label +
                '<form action="/index" method="POST">'+
                '<input type="hidden" value="' + exec._id + '" name="id">' +
                '<input type="hidden" value="' + input + '" name="likeid">' +
                '<input type="hidden" value=1 name="like">' +
                '<input type="hidden" value=3 name="type">' +
                '<button class="btn btn-dark">Like</button><br>' +
                '</form></p>';
                // console.log(specs.elements.includes(input));
                // console.log(datasets.elements.includes(input));
                // console.log(matequip.elements.includes(input));
                // console.log(samples.elements.includes(input));
                // console.log(equations.elements.includes(input));
                found = false;
                i = i+1;
                description = '';
                label = '';
                name = '';
                conditions= '';
            });
        }}

        res = res + '</div>';
        res = res + '<p>Outputs:</p>' +
        '<div class="container text-center" style="border-width: 1px;border: solid; border-color: black">';
        
        if(procedure.outputs){
        if (procedure.outputs.ids){
            var i = 1;
            procedure.outputs.ids.forEach(output =>{

                specs.elements.forEach(thing =>{
                    if (thing._id == output){
                        description = thing.description;
                        label = 'Label: ' + thing.label;
                        found = true;
                    }
                });

                if(!found){
                    datasets.elements.forEach(thing =>{
                        if(thing._id == output){
                            description = thing.name;
                            label = 'Description: ' + thing.description;
                            found= true;
                        }
                    })
                }
                
                if(!found){
                    matequip.elements.forEach(thing =>{
                        if(thing._id == output){
                            description = thing.name;
                            label = thing.description;
                            found = true;
                        }
                    });
                }

                if(!found){
                    samples.elements.forEach(thing=>{
                        if(thing._id == output){
                            description = thing.description;
                            label = "Label " + thing.label;
                            conditions = 'Conditions: ' + thing.conditions;
                            found = true;
                        }
                    });
                }

                if (!found){
                    equations.elements.forEach(thing=>{
                        if(thing._id == output){
                            description = thing.name;
                            label = 'Latex: ' + thing.latex;
                            found = true;
                        }
                    });
                }
                
                res = res + '<p>Output ' + i + ': ' + description + '</p>' + 
                '<p>' + name + '</p>' + 
                '<p>' + conditions + '</p>' +
                '<p>' + label + 
                '<form action="/index" method="POST">'+
                '<input type="hidden" value="' + exec._id + '" name="id">' +
                '<input type="hidden" value="' + output + '" name="likeid">' +
                '<input type="hidden" value=1 name="like">' +
                '<input type="hidden" value=3 name="type">' +
                '<button class="btn btn-dark">Like</button><br>' +
                '</form></p>';
                found = false;
                i = i+1;
                description = '';
                label = '';
                name = '';
                onditions= '';
            });
        }}
        res = res + '</div>';
    });

    res = res + '</div><div id="Social" class="tabcontent">' +
    '<h3>Authors</h3>';
    doc.authors.forEach(author =>{
        let auname = 'not found';
        auths.forEach(x => {

            if (String(x._id) == String(author.author_id)){
                auname = x.name;
                console.log(x.name);
                
            }
        });
        res = res + '<p> Author: ' + auname + '</p>' +
        '<p>Role: ' + author.role + 
        '<form action="/index" method="POST">'+
        '<input type="hidden" value="' + exec._id + '" name="id">' +
        '<input type="hidden" value="' + author.author_id + '" name="likeid">' +
        '<input type="hidden" value=1 name="like">' +
        '<input type="hidden" value=1 name="type">' +
        '<button class="btn btn-dark">Like</button><br>' +
        '</form></p>';
    });
    doc.institution.forEach(inst =>{
        let instname = 'not found';
        insts.forEach(x => {
            if(String(x._id) == String(inst.institution_id)){
                instname = x.name
            }
        })
        res = res + '<p> Institution : ' + instname +
        '<form action="/index" method="POST">'+
        '<input type="hidden" value="' + exec._id + '" name="id">' +
        '<input type="hidden" value="' + inst.institution_id + '" name="likeid">' +
        '<input type="hidden" value=1 name="like">' +
        '<input type="hidden" value=4 name="type">' +
        '<button class="btn btn-dark">Like</button><br>' +
        '</form></p>';
    });
    doc.project.forEach(proj =>{
        let projname = 'not found';
        projs.forEach(x=>{
            console.log(x._id);
            console.log(proj.project_id);
            if(String(x._id)==String(proj.project_id)){
                projname = x.name;
            }
        });
        res = res + '<p> Project :' + projname +
        '<form action="/index" method="POST">'+
        '<input type="hidden" value="' + exec._id + '" name="id">' +
        '<input type="hidden" value="' + proj.project_id + '" name="likeid">' +
        '<input type="hidden" value=1 name="like">' +
        '<input type="hidden" value=5 name="type">' +
        '<button class="btn btn-dark">Like</button><br>' +
        '</form></p>';
    });

    res = res + '</div><div id="Recomendaciones" class="tabcontent">' +
    '<h3>Recomendaciones</h3>' +
    '<div class="container text-center" style="border-width: 1px;border: solid; border-color: black">'+
    '<p>Content</p>';

    recommends.forEach(reco =>{
        res = res + '<p>' + reco + '</p>'
    })

    res = res + '</div></div>';

    res = res +
    '<form action="/index" method="POST">'+
    '<input type="hidden" value="' + exec._id + '" name="id">' +
    '<input type="hidden" value="' + exec._id + '" name="likeid">' +
    '<input type="hidden" value=1 name="like">' +
    '<input type="hidden" value=0 name="type">' +
    '<button class="btn btn-dark">Like</button><br>' +
    '</form>';



    return res;


});

hbs.registerHelper('desmatricular', (curso, cedulaMatriculados, usuarios) => {
    
    let texto;
    console.log(cedulaMatriculados)
    console.log(usuarios)


    texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>CEDULA:</th>\
                <th>NOMBRE:</th>\
                <th>CORREO:</th>\
                <th>TELEFONO:</th>\
                </thead>\
                <tbody>";

    cedulaMatriculados.forEach(matriculado => {
        let user = usuarios.find(ver => ver.cedula == matriculado);
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
});

hbs.registerHelper('cerrar', (id) => {

    let texto = ("<form action='/docenteasignado?id=" + id + "' method='post'>" +
        "<p>Cedula:</p>" +
        "<input type='number' name='cedula' required>" +
        " <br>" +
        " <br>" +
        " <button class='btn btn-dark'>ASIGNAR</button>" +
        "<br>" +
        "</form>")



    return texto;
});

hbs.registerHelper('eliminarCurso', (cedula, cursosF) => {

    let texto;

    // console.log(cursosF)

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

    cursosF.forEach(cursos => {
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

hbs.registerHelper('listar2', (cursosD, matriculasD) => {

    let texto;

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

    cursosD.forEach(cursos => {

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
            "Personas inscritas: " + matriculasD.filter(ver => ver.id == cursos.id).length +
            '</div></div></div></div></td>' +
            '<td><form action="/cerrado?id=' + cursos.id + ' " method="post"><button class="btn btn-dark">CERRAR</button></form></td>' +
            '</tr>');

    })
    texto = (texto + "</tbody></table></div>");

    return texto;
});

hbs.registerHelper('listar', (usuario, listaCursos,listaMatriculas,listaUsuarios) => {

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
    } 
    else if(usuario.tipo == 'docente'){
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
            if (cursos.docente == usuario.cedula) {
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
                    '<div class="card-body">')

                    listaMatriculas.filter(ver=>ver.id==cursos.id).forEach(ma=>{
                        texto=(texto + "Nombre: " + listaUsuarios.find(v => v.cedula == ma.cedula).nombre + "<br>Correo: " + listaUsuarios.find(v => v.cedula == ma.cedula).correo + "<br><br>")
                    })

                   texto =( texto + '</div></div></div></div></td>' +
                    '<td><form action="/inscrito?cedula=' + usuario.cedula + '&id=' + cursos.id + ' " method="post"><button class="btn btn-dark">INSCRIBIR</button></form></td>' +
                    '</tr>');
            }
        })
        texto = (texto + "</tbody></table><form action='/aspirante?cedula=" + usuario.cedula + "' method='post'><button class='btn btn-dark'>DARME DE BAJA EN UN CURSO</button></form><br></div>");
    }
    else {

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