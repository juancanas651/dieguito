function abrircaja(imageUrl) {

    document.getElementById('imagen').src = imageUrl;
    document.getElementById('caja').style.display = 'flex';
}

function cerrarcaja(event) {
    const caja = document.getElementById('caja');
    const image = document.getElementById('imagen');


    if (event.target !== image) {
        caja.style.display = 'none';

    }
}

// Añadir el evento de scroll para hacer zoom
const image = document.getElementById('imagen');
let scale = 1;

image.addEventListener('wheel', function(event) {
    event.preventDefault(); // Evitar que la página se desplace al hacer zoom

    // Definir el factor de zoom
    const zoomFactor = 0.1;

    // Ajustar la escala según el scroll
    if (event.deltaY < 0) {
        // Scroll hacia arriba (acercar)
        scale += zoomFactor;
    } else {
        // Scroll hacia abajo (alejar)
        scale = Math.max(1, scale - zoomFactor); // Evitar que la escala sea menor a 1
    }

    // Aplicar la transformación de escala
    image.style.transform = `scale(${scale})`;
});
