<?php
// FICHERO: api/get/tablero.php
// PETICIONES GET ADMITIDAS:
//   api/tablero/{TAMAÑO} -> devuelve un tablero aleatorio del tamaño (TAMAÑOxTAMAÑO) indicado. Si no se indica tamaño, por defecto asigna un tamaño de 4.
// =================================================================================
// RECURSO
// =================================================================================
if(strlen($_GET["_rec_"]) > 0)
    $RECURSO = explode("/", substr($_GET["_rec_"],1));
else
    $RECURSO = [];
$TAMANYO = array_shift($RECURSO);
if(!is_numeric($TAMANYO))
    $TAMANYO = 4;
// =================================================================================
// FUNCIONES AUXILIARES
// =================================================================================
// Devuelve el número de celdas vecinas que son jugables
function celdasVecinasJugables($tablero, $i, $j){
    global $TAMANYO, $NO_JUGABLE;
    $celdasJugables = 0;

    for($fila = max($i - 1,0); $fila <= min($i + 1, $TAMANYO - 1); $fila++){
        for($col = max($i - 1,0); $col <= min($i + 1, $TAMANYO - 1); $col++){
            if($tablero[$fila][$col] != $NO_JUGABLE)
                $celdasJugables++;
        }
    }

    return $celdasJugables;
}
// Devuelve true si la celda indicada se puede marcar como no jugable
function celdaCorrecta($tablero, $i, $j){
    global $VACIA, $NO_JUGABLE;
    $valRet = false;

    if($tablero[$i][$j] == $VACIA){
        // Primero se marca la celda como no jugable para que no se cuente
        // como jugable
        $tablero[$i][$j] = $NO_JUGABLE;
        // Hay que comprobar si al poner esta celda como no jugable,
        // una única celda jugable se queda "encerrada"
        // Arriba
        if( celdasVecinasJugables($tablero, $i - 1, $j) > 1 ){
            // Abajo
            if( celdasVecinasJugables($tablero, $i + 1, $j) > 1 ){
                // Izquierda
                if( celdasVecinasJugables($tablero, $i, $j - 1) > 1 ){
                    // Derecha
                    if( celdasVecinasJugables($tablero, $i, $j + 1) > 1 ){
                        $valRet = true;
                    }
                }
            }
        }
        // Se vuelve a poner como vacía por si no se ha podido marcar
        // como no jugable
        $tablero[$i][$j] = $VACIA;
    }

    return $valRet;
}
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R = [];  // Almacenará el resultado.
// =================================================================================
// Se genera el tablero de juego
// =================================================================================
$VACIA      = 0; // Valor que indica celda vacía
$NO_JUGABLE = -1; // Valor asignado a la celda no jugable
$tablero    = [];
for($i = 0; $i < $TAMANYO; $i++){
    $tablero[] = [];
    for($j = 0; $j < $TAMANYO; $j++){
        $tablero[$i][] = $VACIA;
    }
}
// Ahora se generan las celdas no jugables
$no_jugables = .2; // Porcentaje de celdas no jugables
$nCeldasNoJugables = round( ($TAMANYO * $TAMANYO) * $no_jugables );
while( $nCeldasNoJugables > 0){
    do{
        $i = rand(0, $TAMANYO - 1);
        $j = rand(0, $TAMANYO - 1);
    }while( !celdaCorrecta($tablero, $i, $j) );
    $tablero[$i][$j] = $NO_JUGABLE;
    $nCeldasNoJugables--;
}
// =================================================================================
// Se termina de configurar la respuesta con el tablero generado
// =================================================================================
$RESPONSE_CODE  = 200; // código de respuesta por defecto: 200 - OK
$R['CODIGO']    = $RESPONSE_CODE;
$R['RESULTADO'] = 'OK';
$R['TABLERO']   = $tablero;
// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
http_response_code($RESPONSE_CODE);
echo json_encode($R);
?>