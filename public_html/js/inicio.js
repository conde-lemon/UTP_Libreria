// inicio.js (versión actualizada)
document.addEventListener('DOMContentLoaded', () => {
    // Pequeña animación de entrada para las tarjetas de características
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 120 * index);
    });

    // Cargar productos destacados en el carrusel mejorado
    cargarProductosDestacados();

    // Solo para depuración: mostrar cuántos ítems hay en el carrito (si existe)
    try {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        console.log('Carrito actual (inicio):', carrito.length, 'productos');
    } catch (e) {
        console.warn('No se pudo leer el carrito en inicio:', e);
    }
});

async function cargarProductosDestacados() {
    try {
        const container = document.getElementById('product-carousel-section');
        if (!container) return;

        // Mostrar estado de carga
        container.innerHTML = `
            <h2 class="section-title text-center mb-4">Productos Destacados</h2>
            <div class="carousel-loading">
                <div class="spinner"></div>
            </div>
        `;

        const response = await fetch('data/productos.json');
        const data = await response.json();
        
        const todosLosProductos = [...data.libros, ...data.papeleria, ...data.utiles];
        const productosDestacados = todosLosProductos.slice(0, 12);

        // Reconstruir el HTML del carrusel
        container.innerHTML = `
            <h2 class="section-title text-center mb-4">Productos Destacados</h2>
            <div class="carousel-container">
                <button class="carousel-control carousel-control-prev" id="carousel-prev">
                    <i class="bi bi-chevron-left"></i>
                </button>
                
                <div class="carousel-inner">
                    <div class="carousel-track" id="carousel-track">
                        ${productosDestacados.map(producto => `
                            <div class="carousel-item">
                                <div class="producto-card h-100">
                                    <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='recourses/logo/logo_tup.png'">
                                    <h3>${producto.nombre}</h3>
                                    <p class="descripcion">${producto.descripcion}</p>
                                    <div class="precio">S/ ${producto.precio.toFixed(2)}</div>
                                    <a href="Productos.html?id=${producto.id}" class="btn btn-primary mt-auto">Ver más</a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <button class="carousel-control carousel-control-next" id="carousel-next">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
            
            <div class="carousel-indicators" id="carousel-indicators">
                <!-- Los indicadores se generarán dinámicamente -->
            </div>
        `;

        // Inicializar el carrusel
        inicializarCarrusel();

    } catch (error) {
        console.error('Error cargando productos destacados:', error);
        const container = document.getElementById('product-carousel-section');
        if (container) {
            container.innerHTML = `
                <h2 class="section-title text-center mb-4">Productos Destacados</h2>
                <div class="text-center text-muted">
                    <p>No se pudieron cargar los productos destacados.</p>
                    <button onclick="cargarProductosDestacados()" class="btn btn-outline-primary">Reintentar</button>
                </div>
            `;
        }
    }
}

function inicializarCarrusel() {
    const track = document.getElementById('carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    
    if (!track || items.length === 0) return;

    let currentIndex = 0;
    const itemsPerView = calcularItemsPorVista();
    
    // Calcular el ancho de cada item incluyendo el gap
    const itemWidth = items[0].offsetWidth + parseFloat(getComputedStyle(track).gap);
    
    // Generar indicadores
    if (indicatorsContainer) {
        const totalSlides = Math.max(1, items.length - itemsPerView + 1);
        indicatorsContainer.innerHTML = Array.from({ length: totalSlides }, (_, i) => 
            `<div class="indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`
        ).join('');
    }

    function calcularItemsPorVista() {
        const width = window.innerWidth;
        if (width >= 1200) return 6;
        if (width >= 992) return 5;
        if (width >= 768) return 4;
        if (width >= 576) return 3;
        if (width >= 400) return 2;
        return 1;
    }

    function updateCarousel() {
        const translateX = -currentIndex * itemWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Actualizar estado de botones
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= items.length - itemsPerView;
        
        // Actualizar indicadores
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        if (currentIndex < items.length - itemsPerView) {
            currentIndex++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Navegación por indicadores
    if (indicatorsContainer) {
        indicatorsContainer.addEventListener('click', (e) => {
            const indicator = e.target.closest('.indicator');
            if (indicator) {
                currentIndex = parseInt(indicator.dataset.index);
                updateCarousel();
            }
        });
    }

    // Responsive: recalcular en resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newItemsPerView = calcularItemsPorVista();
            if (currentIndex > items.length - newItemsPerView) {
                currentIndex = Math.max(0, items.length - newItemsPerView);
            }
            updateCarousel();
        }, 250);
    });

    // Inicializar
    updateCarousel();
}