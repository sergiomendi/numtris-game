
//  COMPROBACIÓN DE SI ESTÁ JUGANDO (FALTA TERMINAR)------------------------------------------------

if(sessionStorage['PARTIDA']){
    location.href="juego.html";
    console.log('entra?')
}else{
    location.href='index.html';
}
//  COMPROBACIÓN DE SI ESTÁ JUGANDO (FALTA TERMINAR)------------------------------------------------


// *********************TABLA PUNTUACIONES*********************************************************
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
        generarTablaPuntuaciones();
    } else {
        const body = document.getElementById('divPuntuaciones');
        const noResults = document.createElement('p');
        noResults.id = 'noResults';
        noResults.innerHTML = 'Todavía no hay puntuaciones guardadas.<br>¡¡¡Se el primero en conseguir una puntuación máxima!!!';
        body.appendChild(noResults);
    }

    // // agregar una nueva puntuación
    // const nuevaPuntuacion = { nombre: 'Jugador 3', puntuacion: 10 };
    // puntuaciones.push(nuevaPuntuacion);
    // generarTablaPuntuaciones();

});

// *********************TABLA PUNTUACIONES*********************************************************


// ***************FORMULARIO****************************************************


function startGame() {
    let player1 = document.getElementById("player1").value;
    let player2 = document.getElementById("player2").value;

    if (player1.trim() === "" || player2.trim() === "") {
        document.getElementById("error-message").innerText = "Ambos nombres de jugadores son requeridos.";
    } else {
        document.getElementById("error-message").innerText = "";
        let res={
           "jugador1":player1,
           "jugador2":player2

        }
        sessionStorage['JUGADORES'] = JSON.stringify(res);
        location.href='juego.html';
    }
}

function clearForm() {
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";
    document.getElementById("error-message").innerText = "";
}

// ***************FORMULARIO*****************************************************
