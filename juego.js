let numeroSeleccionado = null;
const ANCHO = 480;
const ALTO = 360;
let suma = 0;
let suma2 = 0;
let claseBoton;
let casillaAnterior = null;


let entrart= false;

// -------------- COMPROBACIÓN DE SI ESTÁ JUGANDO ------------------------------------------------

if (sessionStorage['JUGADORES']) {
    // location.href = "juego.html";
} else {
    location.href = 'index.html';
}
// --------------- COMPROBACIÓN DE SI ESTÁ JUGANDO ------------------------------------------------


async function tablaNumeros() {
    await esperarCargaSessionStorage();
    let numeros = JSON.parse(sessionStorage.getItem('PARTIDA')).numerosElegibles;
    let nums = document.getElementById('nums');

    // // Verificar si el div está vacío
    // if (nums.children.length === 4) {
    //     // No hacer nada si ya existen los botones
    //     return;
    // }

    // Limpiar los botones existentes
    nums.innerHTML = '';
    for (let i = 0; i < numeros.length; i++) {
        if (numeros[i] !== "&nbsp") {
            let div = document.createElement('button');
            div.classList.add("numerosElegibles");
            div.classList.add(`${i}`);
            //div.classList.add(`${i}`);
            // div.id = "numerosElegibles";
            div.innerHTML = numeros[i];
            nums.appendChild(div);

            div.addEventListener('mouseover', function () {
                if (!div.classList.contains('vacio')) {
                    div.style.cursor = 'pointer';
                    div.classList.add('destacado');

                } else {
                    div.style.cursor = 'not-allowed';
                }
            });

            div.addEventListener('mouseout', function () {
                div.style.cursor = 'auto';
                div.classList.remove('destacado');
            });

            div.addEventListener('click', function () {
                let seleccionados = document.getElementsByClassName('seleccionado');
                if (!div.classList.contains('vacio')) {
                    // Limpiar selección previa
                    let seleccionados = document.getElementsByClassName('seleccionado');
                    for (let j = 0; j < seleccionados.length; j++) {
                        seleccionados[j].classList.remove('seleccionado');
                    }

                    // Seleccionar el número actual
                    div.classList.add('seleccionado');
                    // Guardar el número seleccionado
                    numeroSeleccionado = numeros[i];
                    claseBoton = this.classList[1];
                }
            });
        } else {
            let div = document.createElement('button');
            div.classList.add("numerosElegibles");
            div.classList.add(`${i}`);
            div.classList.add('vacio');
            //div.classList.add(`${i}`);
            div.id = "numerosElegibles";
            div.innerHTML = "&nbsp";
            nums.appendChild(div);

            div.addEventListener('mouseover', function () {

                div.style.cursor = 'not-allowed';

            });

            div.addEventListener('mouseout', function () {
                div.style.cursor = 'auto';
                div.classList.remove('destacado');
            });

        }
    }
}
tablaNumeros();
//--------------------PREPARAR CANVAS------------------------------------------------------------------

function prepararCanvas() {
    let cv = document.querySelector('#cv');
    //-----------------CONSEGUIMOS INFORMACIÓN DEL TABLERO ---------------
    if (!sessionStorage['PARTIDA']) {
        let xhr = new XMLHttpRequest(),
            url = 'api/tablero',
            r;

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            r = xhr.response;
            if (r.RESULTADO == 'OK') {
                ponerEventos(r);
            }
        };
        xhr.send();
        pintarCanvas();

    }
    else {
        let TABLERO = JSON.parse(sessionStorage.getItem('PARTIDA')).tablero;
        pintarCanvas();
        for (let i = 0; i < TABLERO.length; i++) {
            for (let j = 0; j < TABLERO[i].length; j++) {
                if (TABLERO[i][j] == -1) {
                    ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
                    ctx.fillRect(j * anchocelda, i * altocelda, anchocelda, altocelda);
                }
                if (TABLERO[i][j] !== -1 && TABLERO[i][j] !== 0) {
                    //Si es distinto de ambos, rellenar el hueco

                    // Recorrer la matriz y colocar los números en el canvas

                    let numero = TABLERO[i][j];

                    ctx.font = 'bold 30px Arial';
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(numero, j * anchocelda + anchocelda / 2, i * altocelda + altocelda / 2);

                }
            }
        }
        seguirPartida();
    }

    //-----------------CONSEGUIMOS INFORMACIÓN DEL TABLERO --------------


}
//--------------------PREPARAR CANVAS------------------------------------------------------------------
async function actualizarTabla() {
    await esperarCargaSessionStorage();             // Espera a que el session storage se cargue
    let tbody = document.getElementById('datostabla');

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

}
actualizarTabla();

// ----------------FUNCIÓN PROMESA PARA ESPERAR AL SESSION STORAGE-----------------------------------
function esperarCargaSessionStorage() {
    return new Promise((resolve) => {
        const intervalo = setInterval(() => {
            if (sessionStorage.getItem('PARTIDA')) {
                clearInterval(intervalo);
                resolve();
            }
        }, 100); // Comprueba cada 100 milisegundos si el session storage se ha cargado
    });
}
// ----------------FUNCIÓN PROMESA PARA ESPERAR AL SESSION STORAGE-----------------------------------

function ponerEventos(r) {
    let celdasClicables = true;
    let numeroAleatorio = Math.round(Math.random());
    let filaAnterior = -1;
    let colAnterior = -1;
    let turnoJugador1 = "espera",
        turnojugador2 = "espera";
    if (numeroAleatorio == 0) {
        turnoJugador1 = "juega";
        let dialog = document.createElement('dialog'),				//CREAMOS DIÁLOGO HTML
            html = '';
        html += '<h3>¡Es el turno de ';
        html += JSON.parse(sessionStorage.getItem('JUGADORES')).jugador1;
        html += '!</h3>';
        html += '<button class="btnn" onclick="cerrarDialogo(0);">Close</button>';

        dialog.innerHTML = html;
        // Aplicar el desenfoque al fondo
        document.body.style.filter = 'blur(4px)';
        document.body.appendChild(dialog);
        dialog.classList.add('dialog');
        dialog.showModal();

    } else {
        turnojugador2 = "juega";
        let dialog = document.createElement('dialog'),				//CREAMOS DIÁLOGO HTML
            html = '';
        html += '<h3>¡Es el turno de ';
        html += JSON.parse(sessionStorage.getItem('JUGADORES')).jugador2;
        html += '!</h3>';
        html += '<button class="btnn" onclick="cerrarDialogo(0);">Close</button>';

        dialog.innerHTML = html;
        // Aplicar el desenfoque al fondo
        document.body.style.filter = 'blur(4px)';
        document.body.appendChild(dialog);
        dialog.classList.add('dialog');
        dialog.showModal();

    }

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

    let copiatablero = r.TABLERO;
    let jug1 = JSON.parse(sessionStorage.getItem('JUGADORES')).jugador1;
    let jug2 = JSON.parse(sessionStorage.getItem('JUGADORES')).jugador2;
    let puntuacion1 = 0;
    let puntuacion2 = 0;

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
                ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
                ctx.fillRect(j * anchocelda, i * altocelda, anchocelda, altocelda);
            }
        }
    }
    function drawCells() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        pintarCanvas();
        let partida = JSON.parse(sessionStorage.getItem('PARTIDA')); // Obtener la partida actualizada
    
        for (let i = 0; i < partida.tablero.length; i++) {
          for (let j = 0; j < partida.tablero[i].length; j++) {
            if (partida.tablero[i][j] == -1) {
              ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
              ctx.fillRect(j * anchocelda, i * altocelda, anchocelda, altocelda);
            }
    
            if (partida.tablero[i][j] !== -1 && partida.tablero[i][j] !== 0) {
              let numero = partida.tablero[i][j];
    
              ctx.font = 'bold 30px Arial';
              ctx.fillStyle = 'black';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(numero, j * anchocelda + anchocelda / 2, i * altocelda + altocelda / 2);
            }
          }
        }
      }

    cv.addEventListener('click', function (evt) {
        let x = evt.offsetX;
        let y = evt.offsetY;
        let altocelda = ALTO / 4;
        let anchocelda = ANCHO / 4;
        let fila, col;
        let PARTIDA = JSON.parse(sessionStorage.getItem('PARTIDA'));
        let tablero = PARTIDA.tablero;
        fila = Math.floor(y / altocelda);
        col = Math.floor(x / anchocelda);



        if (tablero[fila][col] !== 0 || numeroSeleccionado === null) {
            return;
        }
        tablero[fila][col] = numeroSeleccionado;

        comprobacion(tablero, evt);



    });


    cv.addEventListener('mousemove', function (evt) {
        let x = Math.min(Math.max(evt.offsetX, 0), ANCHO - 1); // Asegurarse de que x esté dentro de los límites del canvas
        let y = Math.min(Math.max(evt.offsetY, 0), ALTO - 1); // Asegurarse de que y esté dentro de los límites del canvas
        let altocelda = ALTO / 4;
        let anchocelda = ANCHO / 4;
        let PARTIDA = JSON.parse(sessionStorage.getItem('PARTIDA'));
        let tablero = PARTIDA.tablero;
        let fila = Math.floor(y / altocelda);
        let col = Math.floor(x / anchocelda);

        if (fila >= 0 && fila < 4 && col >= 0 && col < 4) {

            if (tablero[fila][col] !== 0 || numeroSeleccionado === null) {
                cv.style.cursor = 'not-allowed';
            } else {
                cv.style.cursor = 'pointer';
                if (fila !== filaAnterior || col !== colAnterior) {
                    drawCells();
          
                    ctx.strokeStyle = 'yellow';
                    ctx.lineWidth = 3;
          
                    ctx.beginPath();
                    ctx.moveTo(col * anchocelda, fila * altocelda);
                    ctx.lineTo((col + 1) * anchocelda, fila * altocelda);
                    ctx.moveTo((col + 1) * anchocelda, fila * altocelda);
                    ctx.lineTo((col + 1) * anchocelda, (fila + 1) * altocelda);
                    ctx.moveTo((col + 1) * anchocelda, (fila + 1) * altocelda);
                    ctx.lineTo(col * anchocelda, (fila + 1) * altocelda);
                    ctx.moveTo(col * anchocelda, (fila + 1) * altocelda);
                    ctx.lineTo(col * anchocelda, fila * altocelda);
                    ctx.stroke();
          
                    filaAnterior = fila;
                    colAnterior = col;
                  }
            }
        }
    });
    cv.addEventListener('mouseout', function () {
        cv.style.cursor = 'auto';
        drawCells();
        filaAnterior = -1;
        colAnterior = -1;
    });


}

function comprobacion(tablero, evt) {
    let x = evt.offsetX;
    let y = evt.offsetY;
    let altocelda = ALTO / 4;
    let anchocelda = ANCHO / 4;
    let fila, col;
    let PARTIDA = JSON.parse(sessionStorage.getItem('PARTIDA'));
    fila = Math.floor(y / altocelda);
    col = Math.floor(x / anchocelda);

    let fd = new FormData();
    let xhr = new XMLHttpRequest(),
        url = 'api/comprobar',
        re;

    xhr.open('POST', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        re = xhr.response;
        if (re.RESULTADO == 'OK') {
            if (numeroSeleccionado != null && re.CELDAS_SUMA.length === 0) {
                var botonesDerecha = document.getElementsByClassName('seleccionado');
                // Itera sobre los elementos y vacía su contenido
                for (var i = 0; i < botonesDerecha.length; i++) {
                    botonesDerecha[i].innerHTML = "&nbsp";
                    botonesDerecha[i].classList.remove('destacado');
                    botonesDerecha[i].classList.add('vacio');
                }
                // Pintar el número en la casilla correspondiente del canvas
                ctx.font = 'bold 30px Arial';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(numeroSeleccionado, col * anchocelda + anchocelda / 2, fila * altocelda + altocelda / 2);
                // Bloquear la casilla
                tablero[fila][col] = numeroSeleccionado;
                //guardo en el storage
                PARTIDA.tablero = tablero;
                if (PARTIDA.turnojug1 === "espera") {
                    PARTIDA.turnojug1 = "juega";
                    PARTIDA.turnojug2 = "espera";

                } else {
                    PARTIDA.turnojug1 = "espera";
                    PARTIDA.turnojug2 = "juega";
                }
                actualizarTabla();

                sessionStorage.setItem('PARTIDA', JSON.stringify(PARTIDA));
                numeroSeleccionado = null;

                if (re.JUGABLES === 0) {
                    let ganador;
                    if (PARTIDA.puntuacion1 > PARTIDA.puntuacion2) {
                        ganador = PARTIDA.jugador1;

                    } else {
                        ganador = PARTIDA.jugador2;


                    }
                    comprobarPuntuaciones(PARTIDA.jugador1, PARTIDA.puntuacion1);
                    comprobarPuntuaciones(PARTIDA.jugador2, PARTIDA.puntuacion2);

                    let dialog = document.createElement('dialog'),				//CREAMOS DIÁLOGO HTML
                        html = '';
                    html += '<h2>¡GAME OVER!</h2> ';
                    html += '<h3>HA GANADO: ';
                    html += ganador;
                    html += '</h3>';
                    html += '<table id="tabla_over">';
                    html += '<tr><th>Jugador</th><th>Puntuación</th></tr>';
                    html += '<tr><td>' + PARTIDA.jugador1 + '</td><td>' + PARTIDA.puntuacion1 + '</td></tr>';
                    html += '<tr><td>' + PARTIDA.jugador2 + '</td><td>' + PARTIDA.puntuacion2 + '</td></tr>';
                    html += '</table>';
                    html += '<button class="btnn" onclick="cerrarDialogoFinal(0);">ACEPTAR</button>';

                    dialog.innerHTML = html;
                    // Aplicar el desenfoque al fondo
                    document.body.style.filter = 'blur(4px)';
                    document.body.appendChild(dialog);
                    dialog.classList.add('dialog');
                    dialog.showModal();



                }
                sessionStorage.setItem("PARTIDA", JSON.stringify(PARTIDA));
            } else {
                var botonesDerecha = document.getElementsByClassName('seleccionado');
                let posiciones = re.CELDAS_SUMA;
                suma = PARTIDA.puntuacion1;
                suma2 = PARTIDA.puntuacion2;

                for (let i = 0; i < posiciones.length; i++) {
                    let posicion = JSON.parse(posiciones[i]);
                    if (PARTIDA.turnojug1 === "juega") {
                        suma = suma + PARTIDA.tablero[posicion.fila][posicion.col];
                    } else {
                        suma2 = suma2 + PARTIDA.tablero[posicion.fila][posicion.col];
                    }

                    // Pintar casilla en blanco
                    // Limpiar la casilla en blanco utilizando clearRect()
                    ctx.clearRect(posicion.col * anchocelda + 1 + 4, posicion.fila * altocelda + 1 + 4, anchocelda - 2 * 4 - 2, altocelda - 2 * 4 - 2);
                    PARTIDA.tablero[posicion.fila][posicion.col] = 0;
                }
                if (PARTIDA.turnojug1 === "juega") {
                    suma = suma + numeroSeleccionado;
                } else {
                    suma2 = suma2 + numeroSeleccionado;
                }

                numeroSeleccionado = null;

                if (PARTIDA.turnojug1 === "juega") {
                    PARTIDA.puntuacion1 = suma;
                } else {
                    PARTIDA.puntuacion2 = suma2;
                }

                // Itera sobre los elementos y vacía su contenido
                for (var i = 0; i < botonesDerecha.length; i++) {
                    botonesDerecha[i].innerHTML = "&nbsp";
                    botonesDerecha[i].classList.remove('destacado');
                    botonesDerecha[i].classList.add('vacio');

                }
                    
                sessionStorage.setItem("PARTIDA", JSON.stringify(PARTIDA));
                actualizarTabla();
            }

        }
    };
    fd.append('tablero', JSON.stringify(tablero));
    xhr.send(fd);

    var botonesDerecha = document.getElementsByClassName('vacio');

    if (botonesDerecha.length + 1 === 3) {
        //generar los tres numeros aleatorios
        let numeros = [];
        while (numeros.length < 3) {
            let numero = Math.floor(Math.random() * 9) + 1;
            if (numero !== 5 && !numeros.includes(numero)) {
                numeros.push(numero);
            }
        }
        PARTIDA.numerosElegibles = numeros;
        sessionStorage.setItem('PARTIDA', JSON.stringify(PARTIDA));
        tablaNumeros();
    } else {

        PARTIDA.numerosElegibles[claseBoton] = "&nbsp";

    }
}
function seguirPartida() {
    let cv = document.querySelector('#cv');
    const ctx = cv.getContext('2d');
    const ANCHO = cv.width;
    const ALTO = cv.height;
    const altocelda = ALTO / 4;
    const anchocelda = ANCHO / 4;
    let filaAnterior = -1;
    let colAnterior = -1;
  
    function drawCells() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      pintarCanvas();
      let partida = JSON.parse(sessionStorage.getItem('PARTIDA')); // Obtener la partida actualizada
  
      for (let i = 0; i < partida.tablero.length; i++) {
        for (let j = 0; j < partida.tablero[i].length; j++) {
          if (partida.tablero[i][j] == -1) {
            ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
            ctx.fillRect(j * anchocelda, i * altocelda, anchocelda, altocelda);
          }
  
          if (partida.tablero[i][j] !== -1 && partida.tablero[i][j] !== 0) {
            let numero = partida.tablero[i][j];
  
            ctx.font = 'bold 30px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(numero, j * anchocelda + anchocelda / 2, i * altocelda + altocelda / 2);
          }
        }
      }
    }
  
    cv.addEventListener('mousemove', function (evt) {
      let x = Math.min(Math.max(evt.offsetX, 0), ANCHO - 1);
      let y = Math.min(Math.max(evt.offsetY, 0), ALTO - 1);
      let fila = Math.floor(y / altocelda);
      let col = Math.floor(x / anchocelda);
      let TABLERO = JSON.parse(sessionStorage.getItem('PARTIDA')).tablero;
  
      if (fila >= 0 && fila < 4 && col >= 0 && col < 4) {
        if (TABLERO[fila][col] !== 0 || numeroSeleccionado === null) {
          cv.style.cursor = 'not-allowed';
        } else {
          cv.style.cursor = 'pointer';
  
          if (fila !== filaAnterior || col !== colAnterior) {
            drawCells();
  
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 3;
  
            ctx.beginPath();
            ctx.moveTo(col * anchocelda, fila * altocelda);
            ctx.lineTo((col + 1) * anchocelda, fila * altocelda);
            ctx.moveTo((col + 1) * anchocelda, fila * altocelda);
            ctx.lineTo((col + 1) * anchocelda, (fila + 1) * altocelda);
            ctx.moveTo((col + 1) * anchocelda, (fila + 1) * altocelda);
            ctx.lineTo(col * anchocelda, (fila + 1) * altocelda);
            ctx.moveTo(col * anchocelda, (fila + 1) * altocelda);
            ctx.lineTo(col * anchocelda, fila * altocelda);
            ctx.stroke();
  
            filaAnterior = fila;
            colAnterior = col;
          }
        }
      }
    });
  
    cv.addEventListener('mouseout', function () {
      cv.style.cursor = 'auto';
      drawCells();
      filaAnterior = -1;
      colAnterior = -1;
    });
  
    cv.addEventListener('click', function (evt) {
      let x = evt.offsetX;
      let y = evt.offsetY;
      let fila = Math.floor(y / altocelda);
      let col = Math.floor(x / anchocelda);
      let partida = JSON.parse(sessionStorage.getItem('PARTIDA'));
      let TABLERO = partida.tablero; // Usar la partida actualizada
  
      if (TABLERO[fila][col] !== 0 || numeroSeleccionado === null) {
        return;
      }
  
      TABLERO[fila][col] = numeroSeleccionado;
      comprobacion(TABLERO, evt);
      drawCells();
    });
  
    drawCells();
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
    document.body.style.filter = 'blur(4px)';
    document.body.appendChild(dialogo);
    dialogo.classList.add('dialog');
    dialogo.showModal();
}

function terminarPartida() {
    sessionStorage.removeItem('PARTIDA');
    sessionStorage.removeItem('JUGADORES');

    location.href = 'index.html';
}

function cerrarDialogo(valor) {
    document.querySelector('dialog').close();
    document.querySelector('dialog').remove();
    // Restaurar el fondo sin desenfoque
    document.body.style.filter = 'none';
}

function cerrarDialogoFinal(valor) {
    document.querySelector('dialog').close();
    document.querySelector('dialog').remove();
    // Restaurar el fondo sin desenfoque
    document.body.style.filter = 'none';

    terminarPartida();
}

function pintarCanvas() {
    cv.width = ANCHO;
    cv.height = ALTO;

    ctx = cv.getContext('2d'),
        celdas = 4,
        anchocelda = ANCHO / 4,
        altocelda = ALTO / 4;
    //crear celdas---------------------
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 4;

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


function comprobarPuntuaciones(nombre, puntos) {
    var data = JSON.parse(sessionStorage.getItem('_data_')) || {};
    if (Object.keys(data).length < 10) {
        data[Object.keys(data).length] = {
            puntuacion: puntos,
            nombre: nombre
        }
        sessionStorage['_data_'] = JSON.stringify(data);


    }//else if (Object.keys(data).length = 10 &&) {

    //}
}