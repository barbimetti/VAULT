// == ESTRUCTURA DE DATOS
class Producto {
    constructor(nombre, categoria, cantidad, precio, id = Date.now()) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.cantidad = Number(cantidad);
        this.precio = Number(precio);
    }

    calcularTotal() {
        return this.cantidad * this.precio;
    }
}


// == VARIABLES GLOBALES 

let inventario = [];

const form = document.getElementById("formProducto");
const tablaBody = document.querySelector("#tablaProductos tbody");
const totalProductos = document.getElementById("totalProductos");
const valorTotal = document.getElementById("valorTotal");

// ==  CÁLCULOS
function guardarProductos() {
    localStorage.setItem("inventarioVault", JSON.stringify(inventario));
}

function actualizarTotales() {
    const totalCantidad = inventario.reduce((acc, p) => acc + p.cantidad, 0);
    const valorTotalStock = inventario.reduce((acc, p) => acc + p.calcularTotal(), 0);

    totalProductos.textContent = totalCantidad;
    valorTotal.textContent = valorTotalStock.toFixed(2);
}

// == RENDERIZADO DE TABLA
function cargarTabla() {
    tablaBody.innerHTML = ""; 

    inventario.forEach((prod) => {
        const filaHTML = `
            <tr>
                <td>${prod.id}</td>
                <td>${prod.nombre}</td>
                <td>${prod.categoria || "N/A"}</td>
                <td>${prod.cantidad}</td>
                <td>€${prod.precio.toFixed(2)}</td>
                <td>€${prod.calcularTotal().toFixed(2)}</td>
                <td>
                    <button class="btn-actualizar" data-id="${prod.id}" title="Editar Stock">Editar</button>
                    <button class="btn-eliminar" data-id="${prod.id}" title="Eliminar">Eliminar</button>
                </td>
            </tr>
        `;
        tablaBody.innerHTML += filaHTML;
    });

    actualizarTotales();
    guardarProductos();
}

// == LÓGICA DE NEGOCIO 
function agregarProducto(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value;
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const precio = parseFloat(document.getElementById("precio").value);

    if (!nombre || categoria === "" || isNaN(cantidad) || cantidad <= 0 || isNaN(precio) || precio < 0) {
        Swal.fire('Error', 'Completa todos los campos correctamente.', 'warning');
        return;
    }

    const productoExistente = inventario.find(p => p.nombre.toUpperCase() === nombre.toUpperCase());

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        Toastify({
            text: `Stock de ${nombre} actualizado. Nueva cantidad: ${productoExistente.cantidad}`,
            duration: 3000,
            style: { background: "linear-gradient(to right, #731b22, #581318)" },
        }).showToast();
    } else {
        const nuevoProducto = new Producto(nombre, categoria, cantidad, precio);
        inventario.push(nuevoProducto);

        Toastify({
            text: `Producto '${nombre}' agregado.`,
            duration: 3000,
            style: { background: "linear-gradient(to right, #581318, #8a2028)" },
        }).showToast();
    }

    cargarTabla();
    form.reset();
}

function eliminarProducto(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminará este artículo del inventario.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            inventario = inventario.filter(p => p.id !== id);
            cargarTabla();
            Swal.fire('Eliminado!', 'El producto ha sido borrado.', 'success');
        }
    });
}

function editarProducto(id) {
    const fila = [...tablaBody.children].find(tr =>
        tr.querySelector(".btn-actualizar")?.dataset.id == id
    );

    const producto = inventario.find(p => p.id === id);
    const tdCantidad = fila.children[3];
    const tdPrecio = fila.children[4];

    const inputCant = document.createElement("input");
    inputCant.type = "number";
    inputCant.min = "0";
    inputCant.value = producto.cantidad;

    const inputPrecio = document.createElement("input");
    inputPrecio.type = "number";
    inputPrecio.min = "0";
    inputPrecio.step = "0.01";
    inputPrecio.value = producto.precio.toFixed(2);

    tdCantidad.textContent = "";
    tdCantidad.appendChild(inputCant);

    tdPrecio.textContent = "";
    tdPrecio.appendChild(inputPrecio);

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


// == CARGA INICIAL DE DATOS 

const cargarInventario = async () => {
    const inventarioGuardado = localStorage.getItem("inventarioVault");

    if (inventarioGuardado) {
        inventario = JSON.parse(inventarioGuardado).map(item =>
            new Producto(item.nombre, item.categoria, item.cantidad, item.precio, item.id)
        );
    } else {
        try {
            const response = await fetch('./data/productos.json');
            if (!response.ok) throw new Error('Error al cargar productos.json');
            const data = await response.json();
            inventario = data.map(item =>
                new Producto(item.nombre, item.categoria, item.cantidad, item.precio, item.id)
            );
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de carga',
                text: 'No se pudo cargar el inventario inicial JSON.'
            });
        }
    }

    cargarTabla();
};
