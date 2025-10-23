
let productos = [];
let siguienteId = 1;

function iniciarSimulador() {
    alert("Bienvenido a tu control de stock!");
    console.log("Simulador iniciado correctamente");

    let continuar = true;

    while (continuar) {
        let opcion = prompt(
            "¿Qué deseas hacer?\n1. Agregar producto\n2. Ver stock\n3. Actualizar cantidad\n4. Eliminar producto\n5. Salir"
        );

        switch (opcion) {
            case "1":
                agregarProducto();
                break;
            case "2":
                console.log("Stock actual:", productos);
                alert("Revisar la consola para ver el stock completo.");
                break;
            case "3":
                actualizarCantidad();
                break;
            case "4":
                eliminarProducto();
                break;
            case "5":
                continuar = false;
                alert("Saliendo del simulador...");
                break;
            default:
                alert("Opción incorrecta. Intenta nuevamente.");
                break;
        }
    }
}


function agregarProducto() {
    let nombre = prompt("Ingresa el nombre del producto:");
    let cantidad = parseInt(prompt("Ingresa la cantidad inicial:"));

    let producto = {
        id: siguienteId,
        nombre: nombre,
        cantidad: cantidad
    };

    productos.push(producto);
    siguienteId++;

    console.log("Producto agregado:", producto);
    alert("Producto agregado correctamente!");
}

function actualizarCantidad() {
    if (productos.length === 0) {
        alert("No hay productos en el stock todavía.");
        return;
    }

    let nombreBuscado = prompt("Ingresa el nombre del producto a actualizar:");
    let producto = productos.find(p => p.nombre.toLowerCase() === nombreBuscado.toLowerCase());

    if (!producto) {
        alert("No se encontró un producto con ese nombre.");
        return;
    }

    let nuevaCantidad = parseInt(prompt(`Cantidad actual: ${producto.cantidad}. Ingresa la nueva cantidad:`));

    if (nuevaCantidad == "" || nuevaCantidad < 0) {
        alert("Cantidad no válida. Intenta nuevamente.");
        return;
    }

    producto.cantidad = nuevaCantidad;

    console.log("Producto actualizado:", producto);
    alert("Cantidad actualizada correctamente!");
}

function eliminarProducto() {
    if (productos.length === 0) {
        alert("No hay productos en el stock todavía.");
        return;
    }

    let nombreBuscado = prompt("Ingresa el nombre del producto que deseas eliminar:");

    let confirmar = confirm(`¿Seguro que deseas eliminar "${nombreBuscado}" del stock?`);
    if (!confirmar) {
        alert("Operación cancelada.");
        return;
    }

    let encontrado = false;
    let nuevosProductos = [];
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre.toLowerCase() === nombreBuscado.toLowerCase()) {
            console.log("Producto eliminado:", productos[i]);
            alert(`El producto "${productos[i].nombre}" fue eliminado del stock.`);
            encontrado = true;
        } else {
            nuevosProductos.push(productos[i]);
        }
    }

    if (!encontrado) {
        alert("No se encontró un producto con ese nombre.");
    }

    productos = nuevosProductos;
}

iniciarSimulador();
