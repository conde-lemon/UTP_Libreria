
function initializeCart() {
    console.log("Inicializando carrito...");
    
    const modal = document.getElementById("product-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalPrice = document.getElementById("modal-price");
    const modalImage = document.getElementById("modal-image");
    const closeBtn = document.querySelector(".close");
    const notification = document.getElementById("notification");


    closeBtn?.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    window.addEventListener("click", (e) => {
        if (e.target === modal)
            modal.style.display = "none";
    });


    document.querySelectorAll(".item img").forEach((img) => {
        img.addEventListener("click", () => {
            const item = img.closest(".item");

            modalTitle.textContent = item.dataset.title || "Producto";
            modalDescription.textContent = item.dataset.description || "Sin descripción.";
            modalPrice.textContent = "S/ " + (item.dataset.price || "0.00");
            modalImage.src = img.src;
            modalImage.alt = item.dataset.title || "Imagen del producto";

            const modalAddToCartBtn = document.getElementById("modal-add-to-cart");
            modalAddToCartBtn.dataset.id = item.dataset.id;
            modalAddToCartBtn.dataset.title = item.dataset.title;
            modalAddToCartBtn.dataset.description = item.dataset.description;
            modalAddToCartBtn.dataset.price = item.dataset.price;
            modalAddToCartBtn.dataset.image = img.src;

            modal.style.display = "block";
        });
    });


    document.getElementById("modal-add-to-cart")?.addEventListener("click", function () {
        const producto = {
            id: this.dataset.id,
            nombre: this.dataset.title,
            descripcion: this.dataset.description,
            precio: parseFloat(this.dataset.price) || 0,
            imagen: this.dataset.image,
            cantidad: 1,
        };

        agregarAlCarrito(producto);

        modal.style.display = "none";
        if (notification) {
            notification.style.display = "flex";
            setTimeout(() => {
                notification.style.display = "none";
            }, 5000);
        }
    });


    document.querySelectorAll(".item .add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".item");

            const producto = {
                id: item.dataset.id,
                nombre: item.dataset.title,
                descripcion: item.dataset.description,
                precio: parseFloat(item.dataset.price) || 0,
                imagen: item.querySelector("img").src,
                cantidad: 1,
            };

            agregarAlCarrito(producto);
            window.location.href = "Carrito.html";
        });
    });


    const goToCart = document.getElementById("go-to-cart");
    if (goToCart) {
        goToCart.addEventListener("click", () => {
            window.location.href = "Carrito.html";
        });
    }


    document.querySelectorAll(".carousel-track").forEach((track) => {
        if (!track.dataset.cloned) {
            const items = Array.from(track.children);
            items.forEach((item) => {
                const clone = item.cloneNode(true);
                track.appendChild(clone);
            });
            track.dataset.cloned = "true";
        }
    });


    if (document.querySelector('#lista-carrito')) {
        cargarCarrito();
    }
}

function limpiarProductosDePrueba() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito = carrito.filter(p => {
        const nombre = (p.nombre || "").toLowerCase();
        return nombre !== "figura coleccionable" && nombre !== "película blue ray" && nombre !== "undefined";
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
        existente.cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedor = document.querySelector('#lista-carrito');
    const total = document.querySelector('#total');


    if (!contenedor || !total) {
        console.warn("Elementos del carrito no encontrados en el DOM");
        return;
    }

    contenedor.innerHTML = "";
    let suma = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
        total.textContent = "Total: S/ 0.00";
        return;
    }

    carrito.forEach(p => {
        suma += p.precio * p.cantidad;
        contenedor.innerHTML += `
        <div class="producto" data-id="${p.id}">
          <img src="${p.imagen}" alt="${p.nombre}" />
          <div class="info">
            <h3>${p.nombre}</h3>
            <div class="cantidad-control">
              <button type="button" class="btn-cantidad" data-id="${p.id}" data-cambio="-1">-</button>
              <span class="cantidad">${p.cantidad}</span>
              <button type="button" class="btn-cantidad" data-id="${p.id}" data-cambio="1">+</button>
            </div>
            <p>Subtotal: S/ ${(p.precio * p.cantidad).toFixed(2)}</p>
            <button class="eliminar" type="button" data-id="${p.id}">Eliminar</button>
          </div>
        </div>
      `;
    });

    total.textContent = `Total: S/ ${suma.toFixed(2)}`;


    document.querySelectorAll(".btn-cantidad").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const cambio = parseInt(btn.dataset.cambio);
            cambiarCantidad(id, cambio);
        });
    });


    document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            eliminarProducto(id);
        });
    });
}

function cambiarCantidad(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito = carrito.map(p => {
        if (p.id === id) {
            p.cantidad += cambio;
        }
        return p;
    }).filter(p => p.cantidad > 0);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}

function eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}


const items = document.querySelectorAll('.item');
if (items.length > 0) {
    const productos = [];
    items.forEach(item => {
        productos.push({
            title: item.dataset.title,
            description: item.dataset.description,
            id: item.dataset.id,
            price: item.dataset.price,
            image: item.querySelector('img')?.getAttribute('src') || ""
        });
    });
    localStorage.setItem('productosTotales', JSON.stringify(productos));
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado - Carrito.js");
    

    setTimeout(() => {
        initializeCart();
    }, 300);
});


window.initializeCart = initializeCart;
window.cargarCarrito = cargarCarrito;