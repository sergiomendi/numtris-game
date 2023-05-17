const ANCHO = 480;
const ALTO = 360;
//PREPARAR CANVAS
function prepararCanvas() {
    let cv = document.querySelector('#cv');

    cv.width = ANCHO;
    cv.height = ALTO;

    ctx = cv.getContext('2d'),
        celdas = 4,
        anchocelda = ANCHO / 4,
        altocelda = ALTO / 4;
    //crear celdas--------------------------------------------------------------------------------
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;

    for (let i = 1; i < celdas; i++) {
        //verticales
        ctx.moveTo(i * anchocelda, 0);
        ctx.lineTo(i * anchocelda, ALTO);
        //horizontales
        ctx.moveTo(0, i * altocelda);
        ctx.lineTo(ANCHO, i * altocelda);
    }

    ctx.stroke();

}

//  COMPROBACIÓN DE SI ESTÁ JUGANDO ------------------------------------------------

if (sessionStorage['JUGADORES']) {
    location.ref = "juego.html";
} else {
    location.href = 'index.html';
}
//  COMPROBACIÓN DE SI ESTÁ JUGANDO ------------------------------------------------

if (!sessionStorage['PARTIDA']) {
    let xhr = new XMLHttpRequest(),
        url = 'api/tablero',
        r;

    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    console.log(xhr.status)
    xhr.onload = function () {
        r = xhr.response;
        console.log(r);
        if (r.RESULTADO == 'OK') {
            ponerEventos(r);
        }
    };
    xhr.send();
}
else {

}

function ponerEventos(r) {
    let numeroAleatorio = Math.round(Math.random());
    let turnoJugador1 = "espera",
        turnojugador2 = "espera";
    if (numeroAleatorio == 0) {
        turnoJugador1 = "juega";
    } else {
        turnojugador2 = "juega";
    }
    console.log(numeroAleatorio);
    let jug11 = JSON.parse(sessionStorage.getItem('JUGADORES')).jugador1;
    let jug22 = JSON.parse(sessionStorage.getItem('JUGADORES')).jugador2;


    // var tbody = document.querySelector('#tablaPuntuaciones tbody');

    // var filajug1 = document.createElement('tr');
    // filajug1.innerHTML = `<td>${turnoJugador1}</td><td>${jug11}</td><td>0</td>`
    // tbody.appendChild(filajug1);

    // var filajug2 = document.createElement('tr');
    // filajug2.innerHTML = `<td>${turnojugador2}</td><td>${jug22}</td><td>0</td>`
    // tbody.appendChild(filajug2);

    // comprobar si funciona

    //generar los tres numeros aleatorios
    let numeros = [];
    while (numeros.length < 3) {
        let numero = Math.floor(Math.random() * 9) + 1;
        if (numero !== 5 && !numeros.includes(numero)) {
            numeros.push(numero);
        }
    }
    tablaNumeros(numeros);
    console.log(numeros);
    let copiatablero = r.TABLERO;
    let jug1 = JSON.parse(sessionStorage.getItem('JUGADORES')).jugador1;
    let jug2 = JSON.parse(sessionStorage.getItem('JUGADORES')).jugador2;
    let puntuacion1 = 0;
    let puntuacion2 = 0;
    console.log(copiatablero)
    let res = {
        "jugador1": jug1,
        "jugador2": jug2,
        "tablero": copiatablero,
        "numerosElegibles": numeros,
        "turnojug1": turnoJugador1,
        "turnojug2": turnojugador2,
        "puntuacion1": puntuacion1,
        "puntuacion2": puntuacion2,
    }
    sessionStorage['PARTIDA'] = JSON.stringify(res);


    for (let i = 0; i < r.TABLERO.length; i++) {
        for (let j = 0; j < r.TABLERO[i].length; j++) {
            if (r.TABLERO[i][j] == -1) {

            }
        }
    }

    cv.addEventListener('click', function (evt) {//nos interesa offset x y off set y
        let x = evt.offsetX;
        let y = evt.offsetY,
            altocelda = ALTO / 4,
            anchocelda = ANCHO / 4,
            fila, col;
        //console.log(`(x,y)${x} ${y}`);
        fila = Math.floor(y / altocelda);
        col = Math.floor(x / anchocelda);

        console.log(`(fila,col)${fila} ${col}`);

    });

    location.href="juego.html";
}

//Botones nav -----------------------------------------------------------------------

function clickAyuda() {
    let dialogo = document.createElement('dialog'),
        html = '';
    html += '<p> El juego consiste en ir colocando en las casillas vacías del tablero los números que se proporcionan en grupos de tres.';
    html += 'Juegan dos jugadores por turnos. Si al colocar un número en una celda vacía, sumándole el que tiene';
    html += ' arriba/abajo/izquierda/derecha se obtiene un múltiplo de 5, se limpian las casillas correspondientes y el resultado de la suma son los puntos que';
    html += ' acumula el jugador, manteniendo el turno. El juego finaliza cuando ya no quedan casillas vacías en el tablero, ganando el jugador con mayor puntuación ';
    html += '</p>';
    html += '<button onclick="cerrarDialogo(0);">Cerrar</button>';

    dialogo.innerHTML = html;
    document.body.appendChild(dialogo);
    dialogo.showModal();
}

function terminarPartida() {
    sessionStorage.removeItem('PARTIDA');
    sessionStorage.removeItem('JUGADORES');

    location.href = 'index.html';
}

function cerrarDialogo(valor) {
    console.log(valor);
    document.querySelector('dialog').close();
    document.querySelector('dialog').remove();
}

//Actualizar tabla

function actualizarTabla() {
    let tbody = document.getElementById('datostabla');
    document.addEventListener('DOMContentLoaded', function() {
    let fila1 = 0; // Índice de la primera fila
    let fila2 = 1; // Índice de la segunda fila
    let columna1 = 0; // Índice de la primera columna
    let columna2 = 1; // Índice de la segunda columna
    let columna3 = 2; // Índice de la tercera columna

    let jug11 = JSON.parse(sessionStorage.getItem('JUGADORES')).jugador1;
    let jug22 = JSON.parse(sessionStorage.getItem('JUGADORES')).jugador2;

    let turnojug11 = JSON.parse(sessionStorage.getItem('PARTIDA')).turnojug1;
    let turnojug22 = JSON.parse(sessionStorage.getItem('PARTIDA')).turnojug2;

    let punt1 = JSON.parse(sessionStorage.getItem('PARTIDA')).puntuacion1;
    let punt2 = JSON.parse(sessionStorage.getItem('PARTIDA')).puntuacion2;
    
        document.getElementById('turno1').innerHTML = `${turnojug11}`;
        document.getElementById('nombre1').innerHTML = `${jug11}`;
        document.getElementById('punt1').innerHTML = `${punt1}`;
        document.getElementById('turno2').innerHTML = `${turnojug22}`;
        document.getElementById('nombre2').innerHTML = `${jug22}`;
        document.getElementById('punt2').innerHTML = `${punt2}`;
    });
}
actualizarTabla();

function tablaNumeros()
{
    let numeros = JSON.parse(sessionStorage.getItem('PARTIDA')).numerosElegibles;
    console.log(numeros);
    let nums = document.getElementById('nums')
    for(let i=0;i<numeros.length;i++)
    {
     let div = document.createElement('div');
     div.innerHTML = numeros[i];
     nums.appendChild(div);

    }
}
tablaNumeros();