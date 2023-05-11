<?php
// FICHERO: api/post/comprobar.php
// PETICIONES POST ADMITIDAS:
// * api/comprobar -> Comprueba si hay fin de juego o combinaciones de números que suman múltiplo de 5
//       Params: tablero:tablero de juego
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// Se pillan los parámetros
// =================================================================================
$PARAMS = $_POST;
$NUMERO_REFERENCIA = 5; // Número para el que se buscar los múltiplos

$tablero = json_decode($PARAMS['tablero']); // Tablero de juego
$filas   = count($tablero);
$cols    = count($tablero[0]);
$celdas  = []; // array de celdas que suman múltiplo de 5 con el valor de la celda

// Se buscan las celdas que puedan sumar múltiplos de 5
for($i = 0; $i < $filas; $i++){
  for($j = 0; $j < $cols; $j++){
    if($tablero[$i][$j] > 0){ // La celda tiene un número y hay que comprobar si suma un múltiplo de 5 con las vecinas
      // Comprobación sencilla: arriba, abajo, izquierda, derecha
      // Arriba
      if($i > 0)
        if( $tablero[$i - 1][$j] > 0 && ($tablero[$i][$j] + $tablero[$i - 1][$j]) % $NUMERO_REFERENCIA == 0){
          // Es múltiplo
          $celda = '{"fila":' . ($i - 1) . ',"col":' . $j . '}';
          if(!in_array($celda, $celdas))
            $celdas[] = $celda;
        }
      // Abajo
      if($i < $filas - 1)
        if( $tablero[$i + 1][$j] > 0 && ($tablero[$i][$j] + $tablero[$i + 1][$j]) % $NUMERO_REFERENCIA == 0){
          // Es múltiplo
          $celda = '{"fila":' . ($i + 1) . ',"col":' . $j . '}';
          if(!in_array($celda, $celdas))
            $celdas[] = $celda;
        }
      // Izquierda
      if($j > 0)
        if( $tablero[$i][$j - 1] > 0 && ($tablero[$i][$j] + $tablero[$i][$j - 1]) % $NUMERO_REFERENCIA == 0){
          // Es múltiplo
          $celda = '{"fila":' . $i . ',"col":' . ($j - 1) . '}';
          if(!in_array($celda, $celdas))
            $celdas[] = $celda;
        }
      // Derecha
      if($j < $cols - 1)
        if( $tablero[$i][$j + 1] > 0 && ($tablero[$i][$j] + $tablero[$i][$j + 1]) % $NUMERO_REFERENCIA == 0){
          // Es múltiplo
          $celda = '{"fila":' . $i . ',"col":' . ($j + 1) . '}';
          if(!in_array($celda, $celdas))
            $celdas[] = $celda;
        }
    }
  }
}

// Se aplana el array
$celdasJugables = [];
array_walk_recursive($tablero, function($a) use (&$celdasJugables) {
  $celdasJugables[] = $a;
});

// Se cuentan las celdas jugables que quedan en el tablero
$totalJugables = 0;
foreach($celdasJugables as $v ){
  if($v == 0)
    $totalJugables++;
}

// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R                = [];  // Almacenará el resultado.
$RESPONSE_CODE    = 200; // código de respuesta por defecto: 200 - OK
$R['CODIGO']      = $RESPONSE_CODE;
$R['RESULTADO']   = 'OK';
$R['CELDAS_SUMA'] = $celdas;
$R['JUGABLES']    = $totalJugables;

// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
http_response_code($RESPONSE_CODE);
echo json_encode($R);
?>