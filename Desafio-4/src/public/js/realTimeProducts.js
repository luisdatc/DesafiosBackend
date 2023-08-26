const socket = io();

const form = document.getElementById("formId");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const dataForm = new FormData(e.target);
  const prod = Object.fromEntries(dataForm);

  socket.emit("nuevoProductoRealTime", prod); // Emitir un evento para agregar productos en tiempo real
  e.target.reset();
});
