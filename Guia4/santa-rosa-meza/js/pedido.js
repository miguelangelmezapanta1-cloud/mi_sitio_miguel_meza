// ===== 3. Estado del pedido y utilidades =====
const pedido = []; // cada ítem: { nombre, precio, cantidad }

const lista = document.getElementById('lista-pedido');
const totalTexto = document.getElementById('total');
const mensajeVacio = document.getElementById('pedido-vacio');
const aviso = document.getElementById('aviso');
const tituloPedido = document.getElementById('titulo-pedido');

// Elementos del reto
const btnVaciar = document.getElementById('btn-vaciar');
const sugerencia = document.getElementById('sugerencia');
const btnSugerencia = document.getElementById('btn-sugerencia');
const PRECIO_MANTEQUILLA = 2.50;

function soles(monto) {
  return 'S/ ' + monto.toFixed(2);
}

function calcularTotal() {
  return pedido.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

function anunciar(mensaje) {
  aviso.textContent = mensaje;
}

// ===== 4. Dibujar la lista con el DOM =====
function render() {
  lista.replaceChildren(); // borra los <li> anteriores

  for (const item of pedido) {
    const li = document.createElement('li');

    const texto = document.createElement('span');
    const subtotal = soles(item.precio * item.cantidad);
    texto.textContent = `${item.cantidad} × ${item.nombre} · ${subtotal}`;

    // Reto: botones de cantidad (−, +) junto a «Quitar»
    const acciones = document.createElement('div');
    acciones.className = 'acciones-linea';

    const restarBtn = document.createElement('button');
    restarBtn.type = 'button';
    restarBtn.className = 'btn-restar';
    restarBtn.dataset.nombre = item.nombre;
    restarBtn.textContent = '−';
    restarBtn.setAttribute('aria-label', `Restar un ${item.nombre}`);

    const sumarBtn = document.createElement('button');
    sumarBtn.type = 'button';
    sumarBtn.className = 'btn-sumar';
    sumarBtn.dataset.nombre = item.nombre;
    sumarBtn.textContent = '+';
    sumarBtn.setAttribute('aria-label', `Sumar un ${item.nombre}`);

    const quitarBtn = document.createElement('button');
    quitarBtn.type = 'button';
    quitarBtn.className = 'btn-quitar';
    quitarBtn.dataset.nombre = item.nombre;
    quitarBtn.textContent = 'Quitar';
    quitarBtn.setAttribute('aria-label', `Quitar ${item.nombre}`);

    acciones.append(restarBtn, sumarBtn, quitarBtn);
    li.append(texto, acciones);
    lista.append(li);
  }

  totalTexto.textContent = soles(calcularTotal());
  mensajeVacio.hidden = pedido.length > 0;
  btnVaciar.hidden = pedido.length === 0;
  actualizarSugerencia();
}

// ===== 5. Añadir y quitar =====
function agregar(nombre, precio) {
  const existente = pedido.find((item) => item.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    pedido.push({ nombre, precio, cantidad: 1 });
  }
  render();
  anunciar(`Se añadió ${nombre}. Total: ${soles(calcularTotal())}.`);
}

function quitar(nombre) {
  const posicion = pedido.findIndex((item) => item.nombre === nombre);
  if (posicion === -1) return;
  pedido.splice(posicion, 1);
  render();
  anunciar(`Se quitó ${nombre}. Total: ${soles(calcularTotal())}.`);
  tituloPedido.focus(); // el foco no se pierde
}

// Delegación: un solo oyente para todos los botones "Añadir"
document.querySelector('.catalogo').addEventListener('click', (evento) => {
  const boton = evento.target.closest('.btn-anadir');
  if (!boton) return;
  const producto = boton.closest('.producto');
  agregar(producto.dataset.nombre, Number(producto.dataset.precio));
});

// Delegación: un solo oyente para todos los botones de la lista
lista.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button');
  if (!boton) return;
  const nombre = boton.dataset.nombre;

  if (boton.classList.contains('btn-quitar')) {
    quitar(nombre);
  } else if (boton.classList.contains('btn-sumar')) {
    cambiarCantidad(nombre, 1);
  } else if (boton.classList.contains('btn-restar')) {
    cambiarCantidad(nombre, -1);
  }
});

// ===== Reto 1: cantidades + y − =====
function cambiarCantidad(nombre, cambio) {
  const item = pedido.find((i) => i.nombre === nombre);
  if (!item) return;

  // Si la cantidad llega a 0, el producto se quita
  if (item.cantidad + cambio <= 0) {
    quitar(nombre);
    return;
  }

  item.cantidad += cambio;
  render();
  anunciar(`${nombre}: ${item.cantidad} en el pedido. Total: ${soles(calcularTotal())}.`);

  // render() recrea los botones: devolvemos el foco al mismo botón
  const clase = cambio > 0 ? '.btn-sumar' : '.btn-restar';
  for (const b of lista.querySelectorAll(clase)) {
    if (b.dataset.nombre === nombre) {
      b.focus();
      break;
    }
  }
}

// ===== Reto 2: vaciar con confirmación =====
btnVaciar.addEventListener('click', () => {
  if (pedido.length === 0) return;

  if (confirm('¿Seguro que quieres vaciar todo tu pedido?')) {
    pedido.length = 0;
    render();
    anunciar('Se vació el pedido. Total: S/ 0.00.');
    tituloPedido.focus();
  } else {
    anunciar('No se vació el pedido.');
  }
});

// ===== Reto 3: sugerencia honesta =====
function actualizarSugerencia() {
  const hayPan = pedido.some((item) => item.nombre.toLowerCase().startsWith('pan'));
  const yaTieneMantequilla = pedido.some((item) => item.nombre === 'Mantequilla');
  sugerencia.hidden = !(hayPan && !yaTieneMantequilla);
}

// Nada se añade solo: el cliente debe pulsar el botón
btnSugerencia.addEventListener('click', () => {
  agregar('Mantequilla', PRECIO_MANTEQUILLA);
  tituloPedido.focus();
});

render();
