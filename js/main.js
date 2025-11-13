// ---- VARIABLES Y CONSTANTES ----
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let siguienteId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;

const form = document.getElementById("formProducto");
const tablaBody = document.querySelector("#tablaProductos tbody");
const totalProductos = document.getElementById("totalProductos");
const valorTotal = document.getElementById("valorTotal");

// ---- FUNCIONES PRINCIPALES ----
function cargarTabla() {
    tablaBody.innerHTML = "";

    productos.forEach((prod) => {
        const fila = document.createElement("tr");

        // ID
        const tdId = document.createElement("td");
        tdId.textContent = prod.id;
        fila.appendChild(tdId);

        // Nombre
        const tdNombre = document.createElement("td");
        tdNombre.textContent = prod.nombre;
        fila.appendChild(tdNombre);

        // Categoría
        const tdCategoria = document.createElement("td");
        tdCategoria.textContent = prod.categoria || "-";
        fila.appendChild(tdCategoria);

        // Cantidad
        const tdCantidad = document.createElement("td");
        tdCantidad.textContent = prod.cantidad;
        fila.appendChild(tdCantidad);

        // Precio
        const tdPrecio = document.createElement("td");
        tdPrecio.textContent = prod.precio.toFixed(2);
        fila.appendChild(tdPrecio);

        // Total
        const tdTotal = document.createElement("td");
        tdTotal.textContent = (prod.cantidad * prod.precio).toFixed(2);
        fila.appendChild(tdTotal);

        // Acciones
        const tdAcciones = document.createElement("td");

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "btn-actualizar";
        btnEditar.dataset.id = prod.id;

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.dataset.id = prod.id;

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);
        fila.appendChild(tdAcciones);

        tablaBody.appendChild(fila);
    });

    actualizarTotales();
    guardarProductos();
}

// ---- AGREGAR PRODUCTO ----
function agregarProducto(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const precio = parseFloat(document.getElementById("precio").value);

    if (!nombre || isNaN(cantidad) || cantidad < 0 || isNaN(precio) || precio < 0) {
        alert("Completa todos los campos correctamente (cantidad y precio >= 0)");
        return;
    }

    const nuevoProducto = { id: siguienteId++, nombre, categoria, cantidad, precio };
    productos.push(nuevoProducto);

    cargarTabla();
    form.reset();
}

// ---- ELIMINAR PRODUCTO ----
function eliminarProducto(id) {
    productos = productos.filter(p => p.id !== id);
    cargarTabla();
}

// ---- EDITAR CANTIDAD + PRECIO INLINE ----
function editarProducto(id) {
    const fila = [...tablaBody.children].find(tr =>
        tr.querySelector(".btn-actualizar")?.dataset.id == id
    );

    const producto = productos.find(p => p.id === id);

    const tdCantidad = fila.children[3];
    const tdPrecio = fila.children[4];

    // Crear inputs
    const inputCant = document.createElement("input");
    inputCant.type = "number";
    inputCant.min = "0";
    inputCant.value = producto.cantidad;

    const inputPrecio = document.createElement("input");
    inputPrecio.type = "number";
    inputPrecio.min = "0";
    inputPrecio.step = "0.01";
    inputPrecio.value = producto.precio.toFixed(2);

    // Reemplazamos el contenido
    tdCantidad.textContent = "";
    tdCantidad.appendChild(inputCant);

    tdPrecio.textContent = "";
    tdPrecio.appendChild(inputPrecio);

    // Cuando sale del input, actualizar
    const actualizar = () => {
        let nuevaCant = parseInt(inputCant.value);
        if (isNaN(nuevaCant) || nuevaCant < 0) nuevaCant = 0;

        let nuevoPrecio = parseFloat(inputPrecio.value);
        if (isNaN(nuevoPrecio) || nuevoPrecio < 0) nuevoPrecio = 0;

        producto.cantidad = nuevaCant;
        producto.precio = nuevoPrecio;

        cargarTabla();
    };

    inputCant.addEventListener("blur", actualizar);
    inputPrecio.addEventListener("blur", actualizar);

    inputCant.focus();
}

// ---- ACTUALIZAR TOTALES ----
function actualizarTotales() {
    const total = productos.reduce((acc, p) => acc + p.cantidad, 0);
    const valor = productos.reduce((acc, p) => acc + (p.cantidad * p.precio), 0);

    totalProductos.textContent = total;
    valorTotal.textContent = valor.toFixed(2);
}

// ---- GUARDAR EN LOCALSTORAGE ----
function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

// ---- EVENTOS ----
form.addEventListener("submit", agregarProducto);

tablaBody.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id);

    if (e.target.classList.contains("btn-eliminar")) {
        eliminarProducto(id);
    }

    if (e.target.classList.contains("btn-actualizar")) {
        editarProducto(id);
    }
});

// ---- CARGA INICIAL ----
cargarTabla();
