// Producto constructor function
function Producto(id, nombre, precio, cantidad = 1) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
}

// Carrito constructor function
function Carrito() {
    this.productos = [];
}

// Agregar un producto al carrito
Carrito.prototype.agregarProducto = function(producto) {
    const existe = this.productos.find(p => p.id === producto.id);
    if (existe) {
        existe.cantidad += 1;
    } else {
        this.productos.push(producto);
    }
    this.actualizarCarrito();
};

// Remover un producto del carrito
Carrito.prototype.removerProducto = function(id) {
    this.productos = this.productos.filter(producto => producto.id !== id);
    this.actualizarCarrito();
};

// Cambiar la cantidad de un producto en el carrito
Carrito.prototype.cambiarCantidad = function(id, cantidad) {
    const producto = this.productos.find(p => p.id === id);
    if (producto) {
        producto.cantidad = cantidad;
        if (producto.cantidad <= 0) {
            this.removerProducto(id);
        } else {
            this.actualizarCarrito();
        }
    }
};

// Calcular el total del carrito
Carrito.prototype.calcularTotal = function() {
    return this.productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
};

// Actualizar el carrito en el DOM
Carrito.prototype.actualizarCarrito = function() {
    const listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = '';

    this.productos.forEach(producto => {
        const li = document.createElement('li');
        li.className = 'carrito-item';
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} x 
            <input type="number" value="${producto.cantidad}" min="1">
            <button class="eliminar">Eliminar</button>
        `;
        const inputCantidad = li.querySelector('input');
        const botonRemover = li.querySelector('button.eliminar');

        inputCantidad.addEventListener('change', (e) => {
            const nuevaCantidad = parseInt(e.target.value);
            this.cambiarCantidad(producto.id, nuevaCantidad);
        });

        botonRemover.addEventListener('click', () => {
            this.removerProducto(producto.id);
        });

        listaCarrito.appendChild(li);
    });

    document.getElementById('total-carrito').textContent = this.calcularTotal();
};

// Crear un nuevo carrito
const miCarrito = new Carrito();

// Manejar el evento de click para agregar productos al carrito
document.querySelectorAll('.agregar-carrito').forEach(boton => {
    boton.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const nombre = e.target.getAttribute('data-nombre');
        const precio = parseFloat(e.target.getAttribute('data-precio'));

        const nuevoProducto = new Producto(id, nombre, precio);
        miCarrito.agregarProducto(nuevoProducto);
    });
});

// Finalizar compra
document.getElementById('finalizar-compra').addEventListener('click', () => {
    alert('¡Su compra ha sido finalizada!');
    miCarrito.productos = [];
    miCarrito.actualizarCarrito();
});
