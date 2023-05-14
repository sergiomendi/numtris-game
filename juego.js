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
                let cv = document.querySelector('#cv'),
                    ctx = cv.getContext('2d'),
                    celdas = 4,
                    anchocelda= ANCHO/4,
                    altocelda= ALTO/4;

                ctx.beginPath();
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 2;

                for(let i = 1 ; i<celdas ; i++)
                {
                    //verticales
                    ctx.moveTo(i* anchocelda,0);
                    ctx.lineTo(i * anchocelda, ALTO);
                    //horizontales
                    ctx.moveTo(0,i*altocelda);
                    ctx.lineTo(ANCHO, i*altocelda);
                }
                let numeroAleatorio = Math.round(Math.random());
                if (numeroAleatorio==0) {
                    //turno para jugador 1
                }else{
                    //turno para jugador 2
                }
                console.log(numeroAleatorio); // Imprimir el número aleatorio generado en la consola

                ctx.stroke();
                ponerEventos(r);

            }
        };
        console.log('Enviando petición de logout...');
        xhr.send();    
}
else{

}

function ponerEventos(r){
    let cv = document.querySelector('#cv');

    for(let i = 0;i<r.TABLERO.length;i++){
        for(let j = 0; j<r.TABLERO[i].length;j++){
            if (r.TABLERO[i][j] == -1) 
            {
                
            }
        }
    }

    cv.addEventListener('click', function(evt){//nos interesa offset x y off set y
        let x = evt.offsetX;
        let y = evt.offsetY,
            altocelda=ALTO/4,
            anchocelda=ANCHO/4,
            fila,col;
        //console.log(`(x,y)${x} ${y}`);
        fila =Math.floor( y/altocelda);
        col = Math.floor(x/anchocelda);

        console.log(`(fila,col)${fila} ${col}`);

    });
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