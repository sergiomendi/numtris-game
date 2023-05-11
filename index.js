
//  COMPROBACIÓN DE SI ESTÁ JUGANDO (FALTA TERMINAR)------------------------------------------------

// if(sessionStorage['_data_']){
//     location.ref="juego.html";
// }else{
//     location.href='index.html';
// }
//  COMPROBACIÓN DE SI ESTÁ JUGANDO (FALTA TERMINAR)------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const puntuaciones = [
        // { nombre: 'Jugador 1', puntuacion: 50 },
        // { nombre: 'Jugador 2', puntuacion: 70 },
        // // ... más puntuaciones
    ];

    function generarTablaPuntuaciones() {
        const tabla = document.getElementById('tablaPuntuaciones');
        const tbody = tabla.querySelector('tbody');

        // limpiar la tabla anterior
        tbody.innerHTML = '';

        // ordenar las puntuaciones de mayor a menor
        const puntuacionesOrdenadas = puntuaciones.slice(0).sort(function (a, b) {
            return b.puntuacion - a.puntuacion;
        });

        // agregar las filas de la tabla con las puntuaciones ordenadas
        for (let i = 0; i < Math.min(puntuacionesOrdenadas.length, 10); i++) {
            const fila = document.createElement('tr');
            const posicion = document.createElement('td');
            posicion.textContent = i + 1;
            fila.appendChild(posicion);
            const nombre = document.createElement('td');
            nombre.textContent = puntuacionesOrdenadas[i].nombre;
            fila.appendChild(nombre);
            const puntuacion = document.createElement('td');
            puntuacion.textContent = puntuacionesOrdenadas[i].puntuacion;
            fila.appendChild(puntuacion);
            tbody.appendChild(fila);
        }
    }



    if (sessionStorage['_data_']) {

        // inicialmente generar la tabla de puntuaciones
        generarTablaPuntuaciones();
    } else {
        const body = document.getElementById('body');
        const noResults = document.createElement('p');
        noResults.id='noResults';
        noResults.innerHTML = 'Todavía no hay puntuaciones guardadas.<br>¡¡¡Se el primero en conseguir una puntuación máxima!!!';
        body.appendChild(noResults);
    }

    // // agregar una nueva puntuación
    // const nuevaPuntuacion = { nombre: 'Jugador 3', puntuacion: 10 };
    // puntuaciones.push(nuevaPuntuacion);
    // generarTablaPuntuaciones();

});