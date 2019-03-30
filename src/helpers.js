const hbs = require('hbs');

hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3) => {
    return (nota1 + nota2 + nota3) / 3
});

hbs.registerHelper('listar', () => {
    listaEstudiantes = require('./listado.json');
    let texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark'>\
                <th>Nombre</th>\
                <th>Matematicas</th>\
                <th>Ingles</th>\
                <th>Programacion</th>\
                </thead>\
                <tbody>";

    listaEstudiantes.forEach(estudiantes => {
        texto = (texto +
            "<tr class='table-info'>" +
            '<td>' + estudiantes.nombre + '</td>' +
            '<td>' + estudiantes.matematicas + '</td>' +
            '<td>' + estudiantes.ingles + '</td>' +
            '<td>' + estudiantes.programacion + '</td>' +
            '</tr>');
    })
    texto = (texto + "</tbody></table></div>");

    return texto;
})