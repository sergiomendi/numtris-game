const ANCHO = 480;
const ALTO = 360;
//PREPARAR CANVAS
function prepararCanvas(){
    let cv = document.querySelector('#cv');

    cv.width = ANCHO;
    cv.height = ALTO;

}

//  COMPROBACIÓN DE SI ESTÁ JUGANDO ------------------------------------------------

if(sessionStorage['JUGADORES']){
    location.ref="juego.html";
}else{
    location.href='index.html';
}
//  COMPROBACIÓN DE SI ESTÁ JUGANDO ------------------------------------------------

if(!sessionStorage['PARTIDA'])
{
    let xhr = new XMLHttpRequest(),
        url = 'api/tablero',
        r;

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        console.log(xhr.status)
        xhr.onload = function()
        {   
            r = xhr.response;
            console.log(r);
            console.log('Respuesta del servidor:', r);
            if(r.RESULTADO == 'OK')
            {
                sessionStorage.removeItem('_datos_');
                console.log('Datos de sesión eliminados correctamente');
            }
        };
        console.log('Enviando petición de logout...');
        xhr.send();    
}
else{

}

//Botones nav -----------------------------------------------------------------------

function clickAyuda(){
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

function cerrarDialogo(valor){
    console.log(valor);
    document.querySelector('dialog').close();
    document.querySelector('dialog').remove();
}