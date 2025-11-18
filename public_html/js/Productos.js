let productos = [];
let categoriaActual = 'todos';

async function cargarProductos() {
    try {
        const response = await fetch('data/productos.json');
        const data = await response.json();
        
        productos = [
            ...data.libros,
            ...data.papeleria,
            ...data.utiles
        ];
        
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function mostrarProductos(productosAMostrar) {
    const grid = document.getElementById('productos-grid');
    
    if (productosAMostrar.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No hay productos disponibles</p>';
        return;
    }
    
    grid.innerHTML = productosAMostrar.map(producto => `
        <div class="producto-card">
            <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='recourses/logo/logo_tup.png'">
            <h3>${producto.nombre}</h3>
            <p class="descripcion">${producto.descripcion}</p>
            <div class="precio">S/ ${producto.precio.toFixed(2)}</div>
            
            <div class="cantidad-control">
                <button onclick="cambiarCantidad(${producto.id}, -1)" id="btn-menos-${producto.id}">
                    <i class="bi bi-dash"></i>
                </button>
                <span class="cantidad" id="cantidad-${producto.id}">1</span>
                <button onclick="cambiarCantidad(${producto.id}, 1)" id="btn-mas-${producto.id}">
                    <i class="bi bi-plus"></i>
                </button>
            </div>
            
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                <i class="bi bi-cart-plus"></i> Agregar al Carrito
            </button>
        </div>
    `).join('');
}

function filtrarPorCategoria(categoria) {
    categoriaActual = categoria;
    
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-categoria="${categoria}"]`).classList.add('active');
    
    const productosFiltrados = categoria === 'todos' 
        ? productos 
        : productos.filter(p => p.categoria === categoria);
    
    mostrarProductos(productosFiltrados);
}

let cantidades = {};

function cambiarCantidad(id, cambio) {
    if (!cantidades[id]) cantidades[id] = 1;
    
    cantidades[id] += cambio;
    if (cantidades[id] < 1) cantidades[id] = 1;
    
    document.getElementById(`cantidad-${id}`).textContent = cantidades[id];
    
    const btnMenos = document.getElementById(`btn-menos-${id}`);
    btnMenos.disabled = cantidades[id] <= 1;
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    const cantidad = cantidades[id] || 1;
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({
            ...producto,
            cantidad: cantidad
        });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    mostrarNotificacion(`${cantidad} ${producto.nombre}(s) agregado(s) al carrito`);
    
    cantidades[id] = 1;
    document.getElementById(`cantidad-${id}`).textContent = 1;
    document.getElementById(`btn-menos-${id}`).disabled = true;
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

function filtrarPorPrecio(rango) {
    document.querySelectorAll('.precio-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-precio="${rango}"]`).classList.add('active');
    
    aplicarFiltros();
}

function aplicarFiltros() {
    const categoriaActiva = document.querySelector('.categoria-btn.active').getAttribute('data-categoria');
    const precioActivo = document.querySelector('.precio-btn.active').getAttribute('data-precio');
    
    let productosFiltrados = productos;
    
    if (categoriaActiva !== 'todos') {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === categoriaActiva);
    }
    
    if (precioActivo !== 'todos') {
        productosFiltrados = productosFiltrados.filter(p => {
            const precio = p.precio;
            switch(precioActivo) {
                case '0-10': return precio >= 0 && precio <= 10;
                case '10-25': return precio > 10 && precio <= 25;
                case '25-50': return precio > 25 && precio <= 50;
                case '50+': return precio > 50;
                default: return true;
            }
        });
    }
    
    mostrarProductos(productosFiltrados);
}

function filtrarPorCategoria(categoria) {
    categoriaActual = categoria;
    
    document.querySelectorAll('.filtro-btn, .categoria-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll(`[data-categoria="${categoria}"]`).forEach(btn => {
        btn.classList.add('active');
    });
    
    aplicarFiltros();
}

document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    
    document.querySelectorAll('.filtro-btn, .categoria-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            filtrarPorCategoria(categoria);
        });
    });
    
    document.querySelectorAll('.precio-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const precio = this.getAttribute('data-precio');
            filtrarPorPrecio(precio);
        });
    });
});