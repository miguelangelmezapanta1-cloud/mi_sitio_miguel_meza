
// ===== 1. Conexión =====
console.log('app.js conectado');

// ===== 2. Funciones de validación =====

// Validar nombre
function validarNombre(nombre) {
    const limpio = nombre.trim();

    if (limpio === '') {
        return 'Escribe tu nombre.';
    }

    if (limpio.length < 2) {
        return 'Tu nombre debe tener al menos 2 letras.';
    }

    return '';
}

// Validar celular
function validarCelular(celular) {
    const limpio = celular.replace(/\s/g, '');

    if (limpio === '') {
        return 'Escribe tu número de celular.';
    }

    if (!/^9\d{8}$/.test(limpio)) {
        return 'El celular debe tener 9 dígitos y empezar con 9. Ejemplo: 987 654 321.';
    }

    return '';
}

// Validar producto
function validarProducto(producto) {
    return producto === '' ? 'Elige un producto.' : '';
}

// Validar cantidad
function validarCantidad(valor) {
    const cantidad = Number(valor);

    if (valor === '' || !Number.isInteger(cantidad) || cantidad < 1) {
        return 'La cantidad debe ser un número entero mayor que 0.';
    }

    if (cantidad > 100) {
        return 'Para más de 100 unidades, llámanos por teléfono.';
    }

    return '';
}

// Validar fecha
function validarFecha(fecha) {
    if (fecha === '') {
        return 'Elige la fecha de recojo.';
    }

    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    const fechaActual = `${anio}-${mes}-${dia}`;

    if (fecha < fechaActual) {
        return 'La fecha de recojo no puede ser anterior a hoy.';
    }

    return '';
}

// ===== 3. Mostrar u ocultar errores =====

function mostrarError(id, mensaje) {
    const campo = document.getElementById(id);
    const error = document.getElementById('error-' + id);

    error.textContent = mensaje;

    if (mensaje) {
        campo.setAttribute('aria-invalid', 'true');
    } else {
        campo.removeAttribute('aria-invalid');
    }
}

// ===== 4. Preparar formulario =====

const formulario = document.querySelector('form');
const estado = document.getElementById('estado');

const reglas = [
    ['nombre', validarNombre],
    ['celular', validarCelular],
    ['producto', validarProducto],
    ['cantidad', validarCantidad],
    ['fecha', validarFecha]
];

// ===== 5. Escuchar el envío =====

formulario.addEventListener('submit', function (evento) {

    evento.preventDefault();

    console.log('VALIDACIÓN INICIADA');

    let primerError = null;

    // Revisar todos los campos
    for (const [id, validar] of reglas) {
        const mensaje = validar(document.getElementById(id).value);

        mostrarError(id, mensaje);

        if (mensaje && primerError === null) {
            primerError = id;
        }
    }

    // Validar consentimiento
    const acepta = document.getElementById('consentimiento').checked;

    const avisoConsentimiento =
        'Necesitamos tu autorización para atender el pedido.';

    mostrarError(
        'consentimiento',
        acepta ? '' : avisoConsentimiento
    );

    if (!acepta && primerError === null) {
        primerError = 'consentimiento';
    }

    // Si hay errores, detener el pedido
    if (primerError !== null) {
        estado.textContent = 'Revisa los campos marcados para continuar.';

        document.getElementById(primerError).focus();

        return;
    }

    // ===== 6. Confirmación del pedido =====

    const nombre = document.getElementById('nombre').value.trim();
    const producto = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;
    const fecha = document.getElementById('fecha').value;

    estado.textContent =
        `Gracias, ${nombre}. Recibimos tu pedido de ` +
        `${cantidad} × ${producto} para el ${fecha}. ` +
        `Te confirmaremos por WhatsApp.`;

    // Limpiar formulario
    formulario.reset();
    // Reiniciar contador y total estimado
contador.textContent = 'Te quedan 200 caracteres';
calcularTotal();

    // Limpiar los estados de error
    for (const [id] of reglas) {
        mostrarError(id, '');
    }

    mostrarError('consentimiento', '');

});

// ===== Reto 2. Contador de caracteres =====

const notas = document.getElementById('notas');
const contador = document.getElementById('contador');

notas.addEventListener('input', function () {
    const caracteresUsados = notas.value.length;
    const caracteresRestantes = 200 - caracteresUsados;

    contador.textContent = `Te quedan ${caracteresRestantes} caracteres`;
});


// ===== Reto 3. Calcular total del pedido =====

// Precios de ejemplo en soles
const precios = {
    'Pan francés': 0.30,
    'Pan de yema': 0.50,
    'Chancay': 1.00,
    'Torta de chocolate': 45.00
};

const campoProducto = document.getElementById('producto');
const campoCantidad = document.getElementById('cantidad');
const total = document.getElementById('total');

function calcularTotal() {
    const producto = campoProducto.value;
    const cantidad = Number(campoCantidad.value);

    if (!producto || !Number.isInteger(cantidad) ||
        cantidad < 1 || cantidad > 100) {
        total.textContent = 'Total estimado: S/ 0.00';
        return;
    }

    const precio = precios[producto] || 0;
    const resultado = precio * cantidad;

    total.textContent = `Total estimado: S/ ${resultado.toFixed(2)}`;
}

campoProducto.addEventListener('change', calcularTotal);
campoCantidad.addEventListener('input', calcularTotal);
