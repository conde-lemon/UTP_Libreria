window.addEventListener('DOMContentLoaded', () => {
    const contenedorCarrito = document.getElementById("contenedorCarrito");
    
    const user = {
        id: "U001",
        email: "usuario@utp.edu.pe"
    };

    const idUsuarioSpan = document.getElementById("idUsuario");
    const correoUsuarioSpan = document.getElementById("correoUsuario");
    if (idUsuarioSpan)
        idUsuarioSpan.textContent = user.id;
    if (correoUsuarioSpan)
        correoUsuarioSpan.textContent = user.email;


    if (contenedorCarrito) {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = "<p style='color: white;'>Tu carrito está vacío.</p>";
        } else {
            carrito.forEach((p, index) => {
                const producto = document.createElement("div");
                producto.classList.add("producto-en-carrito");
                producto.innerHTML = `
                    <div class="contenido-producto">
                        <img src="${p.imagen}" alt="${p.nombre}" class="producto-img" data-index="${index}" />
                        <div class="info">
                            <p class="nombre">${p.nombre}</p>
                            <p class="precio">S/ ${p.precio.toFixed(2)} x ${p.cantidad}</p>
                        </div>
                    </div>
                `;
                contenedorCarrito.appendChild(producto);
            });

            const imagenes = document.querySelectorAll(".producto-img");
            imagenes.forEach(img => {
                img.addEventListener("click", function () {
                    document.querySelectorAll(".producto-en-carrito").forEach(p => p.classList.remove("activo"));
                    this.closest(".producto-en-carrito").classList.add("activo");
                });
            });
        }
    }


    const rastrearBtn = document.getElementById('rastrearBtn');
    const panelRastrear = document.getElementById('pestañaRastrear');
    if (rastrearBtn && panelRastrear) {
        rastrearBtn.addEventListener('click', () => {
            const visible = window.getComputedStyle(panelRastrear).display !== 'none';
            panelRastrear.style.display = visible ? 'none' : 'block';
        });
    }
});


function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal)
        modal.style.display = "flex";
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal)
        modal.style.display = "none";
}


document.querySelector(".botones button:nth-child(2)").addEventListener("click", () => {
    abrirModal("modalReseña");
});
document.querySelector(".botones button:nth-child(3)").addEventListener("click", () => {
    abrirModal("modalDevolucion");
});


function enviarReseña() {
    const texto = document.getElementById("textoReseña").value.trim();
    if (texto) {
        alert("Reseña enviada:\n" + texto);
        cerrarModal("modalReseña");
    } else {
        alert("Escribe algo antes de enviar.");
    }
}

function enviarDevolucion() {
    const texto = document.getElementById("textoDevolucion").value.trim();
    if (texto) {
        alert("Solicitud enviada:\n" + texto);
        cerrarModal("modalDevolucion");
    } else {
        alert("Por favor explica el motivo.");
    }
}

