function redirigir(){
	if (sessionStorage['PARTIDA']) {
		location.href="juego.html"
	}else{
		location.href="index.html"
	}
}