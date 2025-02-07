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
const containerRange = document.getElementById('containerRange');

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
    filtroSeleccionado(event.target.id);
});
menuFiltros.addEventListener('touchstart', (event) => {
    filtroSeleccionado(event.target.id);
});

function filtroSeleccionado(event){
    let filtroSeleccionado = null;
    /**verifica a cual boton dio click para determinar el filtro  que corresponde aplicar */
    (event === 'dropBrillo') ? (filtroSeleccionado = 0 , labelFiltro.innerHTML= 'Brillo'): false ;
    (event === 'dropContraste') ? (filtroSeleccionado = 1 , labelFiltro.innerHTML= 'Contraste'): false ;
    (event === 'dropGrises') ? (filtroSeleccionado = 2 , labelFiltro.innerHTML= 'Escala de Grises'): false ;
    (event === 'dropInvertirTono') ? (filtroSeleccionado = 3 , labelFiltro.innerHTML= 'Invertir Tono'): false ;
    (event === 'dropInvertir') ? (filtroSeleccionado = 4 , labelFiltro.innerHTML= 'Invertir'): false ;
    (event === 'dropSaturacion') ? (filtroSeleccionado = 5 , labelFiltro.innerHTML= 'Saturacion'): false ;
    if (filtroSeleccionado !== null) {
        inputRange.value = parseInt(filtros[filtroSeleccionado]);
        numerito.innerHTML = inputRange.value;
        //esta vuelta cambia el valor del filtro en tiempo real 
        inputRange.oninput = () => {
            filtros[filtroSeleccionado] = parseInt(inputRange.value);
            numerito.innerHTML = inputRange.value;
            apply();
        };
        inputRange.addEventListener('change',almacenarEstado);
        //removemos la clase none para que se muestre en pantalla
        containerRange.classList.remove('none');
    };
}
//verificamos si tiene la clase none , si no la tiene se la agregamos para que este oculto
//mientras no le de a akgun filtro
buttonFiltros.addEventListener('click',()=>{
    oclt()
});

function oclt(){
    (containerRange.classList.contains('none')) ? true: containerRange.classList.add('none');
}

//aplicar filtros al canvas con la imagen
let filtros = [100,100,0,0,0,100];

let grados = 0;

btnIzquierda.addEventListener('click',()=>{
    grados -= 90;
    almacenarEstado()
    apply()
});

btnDerecha.addEventListener('click',()=>{
    grados += 90;
    almacenarEstado()
    apply()
});

// Actualizamos la función apply para que los filtros y la rotación se apliquen juntos
function apply() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Aplicamos los filtros (brillo, contraste, etc.)
    ctx.filter = `brightness(${filtros[0]}%)
                  contrast(${filtros[1]}%)
                  grayscale(${filtros[2]}%)
                  hue-rotate(${filtros[3]}deg)
                  invert(${filtros[4]}%)
                  saturate(${filtros[5]}%)`;
    // Guardamos el contexto para aplicar la rotación
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2); // Mover al centro
    ctx.rotate(grados * Math.PI / 180); // Rotación en grados
    ctx.drawImage(imagen, -imagen.width / 2, -imagen.height / 2); // Dibuja la imagen rotada
    ctx.restore(); // Restauramos el contexto para no afectar futuras operaciones
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
        valor : filtros
    }

    localStorage.setItem(`${cont}`,JSON.stringify(fav));
});

const filtresDiv = document.getElementById('filtresDiv');
const buttonGuardados = document.getElementById('buttonGuardados');
//al hacer click vemos los guardados
buttonGuardados.addEventListener('click',()=>{
    verFav()
});

//muestra los filtros que han sido guardados en el local storage del dispositivo
function verFav() {
    filtresDiv.innerHTML = '';

    for (let i = 0 ; i < cont; i++) {
        let item = localStorage.getItem(`${i}`);
        if (!item) continue; // Evita errores si la clave no existe en localStorage

        let filtrosRecuperados = JSON.parse(item);
        if (!filtrosRecuperados || !filtrosRecuperados.nombre) continue; // Verifica que el objeto es válido

        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = filtrosRecuperados.nombre;
        console.log(filtrosRecuperados)
        li.appendChild(btn);
        filtresDiv.appendChild(li);

        btn.addEventListener('click', (e) => {
            if (filtrosRecuperados.nombre === e.target.textContent) {
                filtros = filtrosRecuperados.valor;
                oclt();
                apply();
                almacenarEstado();
            }
        });
    }
        // Botón para limpiar filtros
    const btnLimpiar = document.createElement('button');
    btnLimpiar.textContent = 'Limpiar Filtros';
    btnLimpiar.addEventListener('click', () => {
        localStorage.clear(); // Borra todos los filtros guardados
        verFav(); // Vuelve a renderizar la lista (quedará vacía)
    });
    
    filtresDiv.appendChild(btnLimpiar);
}
function descargarImagen() {
    const imagenD = canvas.toDataURL("image/png"); // Convertir canvas a imagen
    const enlace = document.createElement("a");
    enlace.href = imagenD;
    enlace.download = "imagen_editada.png"; // Nombre del archivo de salida
    enlace.click(); // Simula un clic para descargar
};
document.getElementById('btnGuardar').addEventListener('click',()=>{
    descargarImagen();
});
//almacenar estados
const btnaAtras = document.querySelectorAll('#btnAtras');
const btnaAdelante = document.querySelectorAll('#btnAdelante');

let filtrosA ={
    f1: 100 ,
    f2: 100 ,
    f3: 0 ,
    f4: 0 ,
    f5: 0 ,
    f6: 100 ,
    g: 0 ,
};
let estados = [];
estados.push({...filtrosA});
let cuen = 0 ;
function almacenarEstado (){
    filtrosA.f1 = filtros[0];
    filtrosA.f2 = filtros[1];
    filtrosA.f3 = filtros[2];
    filtrosA.f4 = filtros[3];
    filtrosA.f5 = filtros[4];
    filtrosA.f6 = filtros[5];
    filtrosA.g = grados

    estados.push({...filtrosA});

    if(estados.length > 10){
        estados.shift();
    };
    cuen = estados.length-1;
};

function retroceder (){
    if(cuen > 0){
        cuen-= 1;
        let stray = estados[cuen];
        filtros[0] = stray.f1;
        filtros[1] = stray.f2;
        filtros[2] = stray.f3;
        filtros[3] = stray.f4;
        filtros[4] = stray.f5;
        filtros[5] = stray.f6;
        grados = stray.g;
        apply()
    }
};
function avanzar (){
    if(cuen < estados.length-1){
        cuen+= 1;
        let stray = estados[cuen];
        filtros[0] = stray.f1;
        filtros[1] = stray.f2;
        filtros[2] = stray.f3;
        filtros[3] = stray.f4;
        filtros[4] = stray.f5;
        filtros[5] = stray.f6;
        grados = stray.g;
        apply()
    }
};

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "z") {
        retroceder()
    }
    if (event.ctrlKey && event.key === "y") {
        avanzar()
    }
});
