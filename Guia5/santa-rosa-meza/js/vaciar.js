// Confirmación de "Vaciar pedido" con el modal de Bootstrap
document.getElementById('confirmarVaciar').addEventListener('click', () => {
  pedido.length = 0;          // el arreglo de pedido.js
  render();
  anunciar('Se vació el pedido. Total: S/ 0.00.');
});
