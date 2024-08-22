function abrircaja(imageUrl) {

    document.getElementById('imagen').src = imageUrl;
    document.getElementById('caja').style.display = 'flex';
}

function cerrarcaja(evento) {
    const caja = document.getElementById('caja');
    const image = document.getElementById('imagen');


    if (evento.target !== image) {
        caja.style.display = 'none';

    }
}

window.onload = function() {

    document.getElementById('promo').style.display = 'flex';

    document.getElementById('cerrarpromo').onclick = function() {
        document.getElementById('promo').style.display = 'none';
    };
};


