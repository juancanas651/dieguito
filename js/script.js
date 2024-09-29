let pantalla = document.getElementById("pantalla");
let resultado = document.getElementById("resultado");

function borrar () {
    pantalla.innerHTML = ''
    resultado.innerHTML = ''
}

function escribir(numerito){
    pantalla.innerHTML += numerito
}

function resul(){
    try {
        resultado.innerText = eval(pantalla.innerText);
    } catch (error) {
        resultado.innerText = 'Error';
    }
}
function escribirTeclado (){

}

pantalla.addEventListener("keydown", function (event) {
   if(event.key === '1' ){
    pantalla.innerHTML='1'
   }
  	
});

