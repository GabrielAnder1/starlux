// Número de WhatsApp de la tienda (cámbialo por el real)
const WHATSAPP_NUMBER = '1234567890';

// Scroll de Categorías con flechas
const categoriesWrapper = document.querySelector('.categories-wrapper');
const scrollBtns = document.querySelectorAll('.scroll-btn');
const leftBtn = scrollBtns[0];
const rightBtn = scrollBtns[1];
const scrollAmount = 340;

function scrollCategories(direction) {
    if (direction === 'left') {
        categoriesWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        categoriesWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function updateScrollButtons() {
    const scrollLeft = categoriesWrapper.scrollLeft;
    const maxScroll = categoriesWrapper.scrollWidth - categoriesWrapper.clientWidth;
    
    if (scrollLeft <= 0) {
        leftBtn.style.opacity = '0.3';
        leftBtn.style.pointerEvents = 'none';
    } else {
        leftBtn.style.opacity = '1';
        leftBtn.style.pointerEvents = 'auto';
    }
    
    if (scrollLeft >= maxScroll - 1) {
        rightBtn.style.opacity = '0.3';
        rightBtn.style.pointerEvents = 'none';
    } else {
        rightBtn.style.opacity = '1';
        rightBtn.style.pointerEvents = 'auto';
    }
}

categoriesWrapper.addEventListener('scroll', updateScrollButtons);
updateScrollButtons();

// Drag con mouse para desktop
let isDragging = false;
let startX = 0;
let scrollStart = 0;

categoriesWrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - categoriesWrapper.offsetLeft;
    scrollStart = categoriesWrapper.scrollLeft;
    categoriesWrapper.style.cursor = 'grabbing';
});

categoriesWrapper.addEventListener('mouseleave', () => {
    isDragging = false;
    categoriesWrapper.style.cursor = 'grab';
});

categoriesWrapper.addEventListener('mouseup', () => {
    isDragging = false;
    categoriesWrapper.style.cursor = 'grab';
});

categoriesWrapper.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - categoriesWrapper.offsetLeft;
    const walk = (x - startX) * 1.5;
    categoriesWrapper.scrollLeft = scrollStart - walk;
});

categoriesWrapper.style.cursor = 'grab';

// Filtrado de productos por categoría
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        if (item.dataset.category === category) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    products.forEach(product => {
        const productCategory = product.dataset.category;
        
        if (category === 'todos' || productCategory === category) {
            product.classList.remove('hidden');
            product.classList.add('fade-in');
            setTimeout(() => {
                product.classList.remove('fade-in');
            }, 500);
        } else {
            product.classList.add('hidden');
        }
    });
    
    document.querySelector('.products-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Botón "Ver Productos" → scroll a sección de productos
document.getElementById('btnProducts').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('productsSection').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
});

// Botón "Ver Galería" → scroll al carrusel
document.getElementById('btnGallery').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('carouselSection').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
});

// Sistema de Carrito
const cart = [];

const cartIcon = document.getElementById('cartIcon');
const cartPanel = document.getElementById('cartPanel');
const panelOverlay = document.getElementById('panelOverlay');
const cartBadge = document.getElementById('cartBadge');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const btnCheckout = document.getElementById('btnCheckout');

// Abrir panel de carrito
cartIcon.addEventListener('click', () => {
    renderCart();
    cartPanel.classList.add('active');
    panelOverlay.classList.add('active');
});

// Cerrar paneles
function closePanels() {
    cartPanel.classList.remove('active');
    panelOverlay.classList.remove('active');
}

panelOverlay.addEventListener('click', closePanels);
document.getElementById('closeCart').addEventListener('click', closePanels);

// Toggle Wishlist en productos
document.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const productCard = this.closest('.product-card');
        const productId = productCard.dataset.id;
        const icon = this.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.style.backgroundColor = '#000';
            this.style.color = '#fff';
            this.style.borderColor = '#000';
            
            const product = {
                id: productId,
                title: productCard.dataset.title,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image,
                available: productCard.dataset.available === 'true'
            };
            
            cart.push(product);
            updateBadges();
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.style.backgroundColor = '#fff';
            this.style.color = '#000';
            this.style.borderColor = '#e5e5e5';
            
            const cartIndex = cart.findIndex(p => p.id === productId);
            if (cartIndex > -1) {
                cart.splice(cartIndex, 1);
            }
            
            updateBadges();
        }
    });
});

function updateBadges() {
    cartBadge.textContent = cart.length;
    cartBadge.style.display = cart.length > 0 ? 'flex' : 'none';
}

function renderCart() {
    if (cart.length === 0) {
        emptyCart.style.display = 'flex';
        cartItems.innerHTML = '';
        cartFooter.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartFooter.style.display = 'block';
    
    const total = cart.reduce((sum, product) => sum + product.price, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    cartItems.innerHTML = cart.map(product => {
        const availabilityText = product.available ? 'Disponible' : 'Agotado';
        const availabilityClass = product.available ? 'available' : 'out-of-stock';
        
        return `
            <div class="panel-item">
                <div class="panel-item-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="panel-item-info">
                    <div class="panel-item-title">${product.title}</div>
                    <div class="panel-item-availability ${availabilityClass}">${availabilityText}</div>
                    <div class="panel-item-price">$${product.price.toFixed(2)}</div>
                </div>
                <button class="panel-item-remove" onclick="removeFromCart('${product.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
}

function removeFromCart(productId) {
    const index = cart.findIndex(p => p.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
    }
    
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (productCard) {
        const icon = productCard.querySelector('.product-wishlist i');
        const btn = productCard.querySelector('.product-wishlist');
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.backgroundColor = '#fff';
        btn.style.color = '#000';
        btn.style.borderColor = '#e5e5e5';
    }
    
    updateBadges();
    renderCart();
}

// Botón SOLICITAR COMPRA → Enviar mensaje a WhatsApp
btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    // Construir lista de productos
    const productosList = cart.map(product => {
        const disponibilidad = product.available ? 'Disponible' : 'Agotado';
        return `• ${product.title} - ${disponibilidad} - $${product.price.toFixed(2)}`;
    }).join('\n');
    
    // Calcular total
    const total = cart.reduce((sum, product) => sum + product.price, 0);
    
    // Construir mensaje completo
    const mensaje = `Hola buen día, me interesaron unas piezas de tu catálogo online:\n\n${productosList}\n\nTotal: $${total.toFixed(2)}`;
    
    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Abrir WhatsApp
    const urlWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, '_blank');
});

updateBadges();