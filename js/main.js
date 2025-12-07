// == EVENTOS E INICIALIZACIÓN
form.addEventListener("submit", agregarProducto);

tablaBody.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id);
    if (e.target.classList.contains("btn-eliminar")) eliminarProducto(id);
    if (e.target.classList.contains("btn-actualizar")) editarProducto(id);
});

cargarInventario();

