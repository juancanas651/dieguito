
/**obtener elementos necesarios de document */

const fileInput = document.querySelector('#fileInput');
const canvas = document.querySelector('#canvasImage');
const ctx = canvas.getContext('2d');
const fondo = document.querySelector('#fondo');
const botonCargar = document.querySelectorAll('#botonCargar');

const canvita = document.querySelector('#canvita');

const numerito = document.getElementById('numerito');

const inputRange = document.querySelector('#inputRange');


const menuFiltros = document.querySelector('#menuFiltros');
const buttonFiltros = document.getElementById('buttonFiltros');
const labelFiltro = document.getElementById('labelFiltro');

const buttonAnadirFavoritos = document.querySelector('#buttonAnadirFavoritos');

const btnIzquierda = document.querySelector('#dropLeft');
const btnDerecha = document.querySelector('#dropRight');

const hpta = document.getElementById('hpta')
/**cargar  la imagen al canvas*/

botonCargar[0].addEventListener('click',function(){
    fileInput.click();
});
botonCargar[1].addEventListener('click',function(){
    fileInput.click();
});

const leer = new FileReader();
const imagen = new Image ();
fileInput.addEventListener('change',(event)=>{
    const archivo = event.target.files[0];
    if(archivo){
        leer.onload = (e) => {
            imagen.onload = ()=>{
                canvas.width = imagen.width;
                canvas.height = imagen.height;
                ctx.drawImage(imagen,0,0);
            };
            imagen.src = e.target.result;
        };
        leer.readAsDataURL(archivo);
        fondo.classList.add('none');
        canvita.classList.remove('none');
    };
});


//elegir el filtro a utilizar y cambiar el input de tipo rango
menuFiltros.addEventListener('click', (event) => {
    let filtroSeleccionado = null;
    /**verifica a cual boton dio click para determinar el filtro  que corresponde aplicar */
    (event.target.id === 'dropBrillo') ? (filtroSeleccionado = 0 , labelFiltro.innerHTML= 'Brillo'): false ;
    (event.target.id === 'dropContraste') ? (filtroSeleccionado = 1 , labelFiltro.innerHTML= 'Contraste'): false ;
    (event.target.id === 'dropGrises') ? (filtroSeleccionado = 2 , labelFiltro.innerHTML= 'Escala de Grises'): false ;
    (event.target.id === 'dropInvertirTono') ? (filtroSeleccionado = 3 , labelFiltro.innerHTML= 'Invertir Tono'): false ;
    (event.target.id === 'dropInvertir') ? (filtroSeleccionado = 4 , labelFiltro.innerHTML= 'Invertir'): false ;
    (event.target.id === 'dropSaturacion') ? (filtroSeleccionado = 5 , labelFiltro.innerHTML= 'Saturacion'): false ;

    if (filtroSeleccionado !== null) {
        inputRange.value = parseInt(filtros[filtroSeleccionado]);
        numerito.innerHTML = inputRange.value;

        //esta vuelta cambia el valor del filtro en tiempo real 
        inputRange.oninput = () => {
            filtros[filtroSeleccionado] = parseInt(inputRange.value);
            numerito.innerHTML = inputRange.value;
            apply();
        };

        //removemos la clase none para que se muestre en pantalla
        hpta.classList.remove('none');
    };
});

//verificamos si tiene la clase none , si no la tiene se la agregamos para que este oculto
//mientras no le de a akgun filtro
buttonFiltros.addEventListener('click',()=>{
    oclt()
});

function oclt(){
    (hpta.classList.contains('none')) ? true: hpta.classList.add('none');
}

//aplicar filtros al canvas con la imagen
let filtros = [100,100,0,0,0,100];

function apply(){
    ctx.filter = `brightness(${filtros[0]}%)
                contrast(${filtros[1]}%)
                grayscale(${filtros[2]}%)
                hue-rotate(${filtros[3]}deg)
                invert(${filtros[4]}%)
                saturate(${filtros[5]}%)` ;
    ctx.drawImage(imagen,0,0);
}

/**usamos en esta parte localstorage para almacenar favoritos de forma local
 * en el dispositivo para luego ser usado de forma facil y rapida
 */

//iniciamos un array , un contador y un objeto para poosterior ser usados de forma global
let keys = [];
let cont = 0;

let use ={
    k:'',
    a:[]
}

// recuperamos del localstorage los valores del array y  el cont para tener actualizadas
//las variables con respecto al disposittivo
const savedData = JSON.parse(localStorage.getItem('tuki'));
if (savedData) {
    keys = savedData.a; // Recuperar el array guardado
    cont = savedData.k; // Recuperar el último valor de cont
}

/**escuchamos el boton , en especifico el click para posteriormente
 * guardar en el local storage los items
 */
buttonAnadirFavoritos.addEventListener('click',()=>{
    cont = keys.length;
    //sumamos aal arreglo el contador
    keys.push(cont+1);
    //lo mismo pero en el objeto
    let object ={
        k:cont+1,
        a:keys
    }
    /**en esta vuelta se manda un item al local storage 
     * con la key 'tuki' y el objeto convertido a string
     */
    localStorage.setItem(`tuki`,JSON.stringify(object));

    /**recuperamos el objeto del local storage y lo volvemos denuevo un objeto
     * parseandolo , y lo almacenamos en use
     */
    use = JSON.parse(localStorage.getItem('tuki'));

    /**almacenamos en un objeto nuevo , el nombre con que va a guardar y los valores de los filtros*/
    let nom = prompt('nombre de favorito');
    let fav ={
        nombre : `${nom}`,
        filt : filtros
    }

    localStorage.setItem(`${cont}`,JSON.stringify(fav));
});


const filtresDiv = document.getElementById('filtresDiv');
const buttonGuardados = document.getElementById('buttonGuardados');

//al hacer click vemos los guardados
buttonGuardados.addEventListener('click',()=>{
    verFav()
})


//muestra los filtros que han sido guardados en el local storage del dispositivo
function verFav(){
    filtresDiv.innerHTML='';
    for(let i = 0 ;i<cont;i++){
        let filtri = JSON.parse(localStorage.getItem(`${i}`));
        const li = document.createElement('li');
        const btn = document.createElement('button')
        btn.textContent = filtri.nombre;
        li.appendChild(btn)
        filtresDiv.appendChild(li);
        
        filtresDiv.addEventListener('click',(e)=>{
            if(filtri.nombre == e.target.textContent){
                filtros = filtri.filt;
                oclt()
                apply()
            }
        });
    }
};

let grados = 0;

const dibujarGrados = (grados) =>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2 )
    ctx.rotate(grados * Math.PI / 180);
    ctx.drawImage(imagen, -imagen.width / 2, -imagen.width / 2 );
    ctx.restore();
}
btnIzquierda.addEventListener('click',()=>{
    grados -= 90;
    dibujarGrados(grados);
});

btnDerecha.addEventListener('click',()=>{
    grados += 90;
    dibujarGrados(grados);
});