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
    if(fondo.classList.contains('none')){ //verififcamos si hay una imagen ya cargada en el canvas
        Swal.fire({//usamos una libreria llamada sweetalert2 para que los alert se vean bonitos 
            title: "¿Estás seguro?",
            text: "Deseas descarga tu edicion previa",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Descargar",
            cancelButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                descargarImagen();
                fileInput.click();
            } else {
              fileInput.click();
            }
          });
    }else{
        fileInput.click();
    };
});
botonCargar[1].addEventListener('click',function(){
    fileInput.click();
});
botonCargar[2].addEventListener('click',function(){
    if(fondo.classList.contains('none')){ //verififcamos si hay una imagen ya cargada en el canvas
        Swal.fire({//usamos una libreria llamada sweetalert2 para que los alert se vean bonitos 
            title: "¿Estás seguro?",
            text: "Deseas descarga tu edicion previa",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Descargar",
            cancelButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                descargarImagen();
                fileInput.click();
            } else {
              fileInput.click();
            }
          });
    }else{
        fileInput.click();
    };
});

const leer = new FileReader();//usamos la api de file reader para leer documentos
const imagen = new Image ();// usamos esta cosa para crear una img , seria como usar el create element
// const imagen = document.createElement('img'); tambien sirve 

fileInput.addEventListener('change',(event)=>{
    //event es pues el elemeto que disparo el evento osea file input 
    //files es una lista de archivos de este input y [0] para que recupere el primero
    const archivo = event.target.files[0];

    if(archivo){//esto verifica que el archivo exista para evitar errores como por ejemplo que cancele la seleccion
        leer.onload = (e) => {//leer es pues el objeto filereader , y onload es un evento que se dispara cuando la lectura del archivo termino

            imagen.onload = ()=>{//imagen es pues la imagen , onload espera a que la imagen se cargue

                canvas.width = imagen.width;//ajusta los tamaños del canvas con respecto a la imagen
                canvas.height = imagen.height;
                ctx.drawImage(imagen,0,0);//finalmente dibuja la imagen en el canvas  
            };
            imagen.src = e.target.result;//esto verifica que el archivo sea correcto y lo carga en la imagen , si no pues no
        };
        leer.readAsDataURL(archivo);//esto convierte el archivo que viene como url en uno como base 64 que no me acuerdo que es , pero luego de verificar ejecuta el onload
        fondo.classList.add('none');//esconde la foto que aparece por defecto
        canvita.classList.remove('none');
        canvita.classList.add('d-flex');//muestra el canvas que estaba previamente oculto 
    };
});

//elegir el filtro a utilizar y cambiar el input de tipo rango
menuFiltros.addEventListener('click', (event) => {
    filtroSeleccionado(event.target.id);
});
menuFiltros.addEventListener('touchstart', (event) => {
    filtroSeleccionado(event.target.id);
});
const filtroMap = {//creamos un objeto que mapea los filtros que pueden ser seleccionados 
    dropBrillo: "brillo",
    dropContraste: "contraste",
    dropGrises: "grises",
    dropInvertirTono: "invertirTono",
    dropInvertir: "invertir",
    dropSaturacion: "saturacion"
};

function filtroSeleccionado(event) {
    const claveFiltro = filtroMap[event];//busca en el objeto el id seleccionado 

    if (!claveFiltro) return; // esto es para que se salga si el filtro no

    labelFiltro.innerHTML = claveFiltro;//escribimos cual fue el filtro seleccionado 

    //le damos los valores correspondientes a cada elemento del DOM
    inputRange.value =  filtros[claveFiltro];
    numerito.innerHTML =  filtros[claveFiltro];
    
    //ejecutamos on input para ejevutar una accion cada ves que se usa el input
    inputRange.oninput = () => {
        filtros[claveFiltro] = +inputRange.value;
        numerito.innerHTML = filtros[claveFiltro];
        apply();
    };

    inputRange.addEventListener('change', almacenarEstado);    //escuchamos el evento change , para almacenar el estado cada vez que el inputrange cambia 
    containerRange.classList.remove('none');//mostramos el input el nombre etc 
}
//mientras no le de a akgun filtro
buttonFiltros.addEventListener('click',()=>{
    oclt()
});

function oclt(){
    (containerRange.classList.contains('none')) ? true: containerRange.classList.add('none');//verificamos si tiene la clase none , si no la tiene se la agregamos para que este oculto
}

//aplicar filtros al canvas con la imagen

let filtros = {//creamos un objeto  con los valores que le vamos a aplicar al canvas , con let para que pueda cambiar
    brillo:      100,
    contraste:   100,
    grises:       0 ,
    invertirTono: 0 ,
    invertir:     0 ,
    saturacion:  100 ,
    grados:       0 ,
};


btnIzquierda.addEventListener('click',()=>{//estos botones son los que manejan los grados
    filtros.grados -= 90;
    almacenarEstado()
    apply()
});

btnDerecha.addEventListener('click',()=>{
    filtros.grados += 90;
    almacenarEstado()
    apply()
});
// Actualizamos la función apply para que los filtros y la rotación se apliquen juntos
function apply() {
    //calculamos el widt y el height para que se adapte a la rotacion de la foto
    if (filtros.grados % 180 !== 0) {//verifica si la rotacion es de 90  o 270 grados  , si si invierte los valores
        canvas.width = imagen.height;
        canvas.height = imagen.width;
    } else {// pues si no los valores son normales 
        canvas.width = imagen.width;
        canvas.height = imagen.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Aplicamos los filtros (brillo, contraste, etc.)
    ctx.filter = `brightness(${filtros.brillo}%)
                  contrast(${filtros.contraste}%)
                  grayscale(${filtros.grises}%)
                  hue-rotate(${filtros.invertirTono}deg)
                  invert(${filtros.invertir}%)
                  saturate(${filtros.saturacion}%)`;
    // Guardamos el contexto para aplicar la rotación
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2); // Mover al centro
    ctx.rotate(filtros.grados * Math.PI / 180); // Rotación en grados
    ctx.drawImage(imagen, -imagen.width / 2, -imagen.height / 2); // Dibuja la imagen rotada
    ctx.restore(); // Restauramos el contexto para no afectar futuras operaciones
}
/**usamos en esta parte localstorage para almacenar favoritos de forma local
 * en el dispositivo para luego ser usado de forma facil y rapida
 */

//iniciamos un array , un contador y un objeto para poosterior ser usados de forma global
let keys = [];
let cont = 0;

// recuperamos del localstorage los valores del array y  el cont para tener actualizadas
//las variables con respecto al disposittivo
function guardadito (){
    const savedData = JSON.parse(localStorage.getItem('tuki'));

    if (savedData) {
        keys = savedData.a; // Recuperar el array guardado
        cont = savedData.k; // Recuperar el último valor de cont
    };
};
guardadito();
/**escuchamos el boton , en especifico el click para posteriormente
 * guardar en el local storage los items
 */
buttonAnadirFavoritos.addEventListener('click',()=>{
    Swal.fire({
        title: "Ingresa el nombre",
        input: "text",
        inputPlaceholder: "esca.....",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
            cont = keys.length;
            //sumamos al arreglo el contador
            keys.push(cont+1);
            //lo mismo pero en el objeto
            let object ={
                k:cont+1,
                a:keys
            }
            /**en esta vuelta se manda un item al local storage 
             * * con la key 'tuki' y el objeto convertido a string*/

            localStorage.setItem(`tuki`,JSON.stringify(object));
            /**recuperamos el objeto del local storage y lo volvemos denuevo un objeto
            * parseandolo , y lo almacenamos en use
            */
            /**almacenamos en un objeto nuevo , el nombre con que va a guardar y los valores de los filtros*/
            let nom = result.value ;
            let fav ={
                nombre : `${nom}`,
                valor : filtros
            }
        
            localStorage.setItem(`${cont}`,JSON.stringify(fav));

            guardadito();
            
        } else {
            console.log('el usuario cancelo')
        }
      });
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
        if (!filtrosRecuperados || !filtrosRecuperados.nombre) continue; // Verifica que el objeto es válido si no se salta el ciclo

        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = filtrosRecuperados.nombre;
        btn.classList.add('btn');
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
    btnLimpiar.textContent = 'Limpiar Favoritos';
    btnLimpiar.classList.add('btn');
    btnLimpiar.addEventListener('click', () => {
        localStorage.clear(); // Borra todos los filtros guardados
        verFav(); // Vuelve a renderizar la lista vacia
    });
    
    filtresDiv.appendChild(btnLimpiar);
}
function descargarImagen() {
    if(fondo.classList.contains('none')){
        const imagenD = canvas.toDataURL("image/png"); // Convertir canvas a imagen
        const enlace = document.createElement("a");//creamos un elemeto a o link en el DOM
        enlace.href = imagenD;//el elemento enlace tiene como href la imagen creada con el canvas
        enlace.download = "imagen_editada.png"; // Nombre del archivo de salida
        enlace.click(); // Simula un clic para descargar el archivo
    }
};

const btnGuardar = document.querySelectorAll('#btnGuardar');

btnGuardar[0].addEventListener('click',descargarImagen);
btnGuardar[1].addEventListener('click',descargarImagen);


//almacenar estados
const btnaAtras = document.querySelectorAll('#btnAtras');
const btnaAdelante = document.querySelectorAll('#btnAdelante');

let estados = [];//creamos el arreglo que va a almacenar los estados por los que ha pasado el canvas

estados.push({...filtros});//hacemos un push para guardar como es el estado 0 del canvas

let cuen = 0 ;//creamos un contador para saber en que posicion del estado estamos 

function almacenarEstado (){
    estados.push({...filtros});//cada vez que se ejecuta la funcion almacena un estado del canvas 
    //los tres puntos es para que no cambien los demas objetos del arreglo con el mismo nombre


    if(estados.length > 10){//cuando el arreglo tiene mas de 10 cosas adentro , elimina la primera para tener un limite de guardado
        estados.shift();
    };
    cuen = estados.length-1;//sincronizamos el contador con el numero de estados guardados en el arreglo
};

function retroceder (){
    if(cuen > 0){ //verifica que el contador sea mayor a 0 para evitar errores con numeros negativos
        cuen-= 1;//como estamos retrocediendo le resta 1 al contador 
        filtros = estados[cuen];//cambia el arreglo filtros al que esta guardado en la posicion con base al contador 
        apply()//aplicamos cambips
    }
};
function avanzar (){
    if(cuen < estados.length-1){//verifica que el contador sea menos al numero de objetos en el arreglo para evitar errores 
        cuen+= 1;//lo mismo de arriba pero al reves
         filtros = estados[cuen];
        apply()
    }
};
//estas fuunciones se ejecutan con el onclick directamente en la etica de button en el html

document.addEventListener("keydown", (event) => {//escucha el documento para saber que teclas son precionadas
    if (event.ctrlKey && event.key === "z") {//si es ctrl z retorcede , si es control y avanza
        retroceder();
    }
    if (event.ctrlKey && event.key === "y") {
        avanzar();
    }
});

function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    sidebar.style.left = "0";
    document.addEventListener('click',miEvento)
};
function miEvento (x){
    if(x.target.id !== 'boton'){
        sidebar.style.left = "-250";

    }
};


const btnRever = document.querySelectorAll('#buttonRever');


const original = {...filtros}

let contad = 0
function rever (){
    let reciente = estados.length-1;
    if(JSON.stringify(filtros) !== JSON.stringify(original)){//toca parserlo a string , porque javascript compara objetos por referencia y no por valor
        filtros = {...original};
    }else{
        filtros = {...estados[reciente]}
    }
    apply()
};


btnRever[0].addEventListener('click',()=>{
    if(fondo.classList.contains('none')){ //verififcamos si hay una imagen ya cargada en el canvas
        rever()
    }else{
    };
});

btnRever[1].addEventListener('click',()=>{
    if(fondo.classList.contains('none')){ //verififcamos si hay una imagen ya cargada en el canvas
        rever()
    }else{
    };
});