//  COMPROBACIÓN DE SI ESTÁ JUGANDO ------------------------------------------------

if(sessionStorage['JUGADORES']){
    location.ref="juego.html";
}else{
    location.href='index.html';
}
//  COMPROBACIÓN DE SI ESTÁ JUGANDO ------------------------------------------------


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