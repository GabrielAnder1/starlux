// Número de WhatsApp de la tienda
const WHATSAPP_NUMBER = '584121035122';

// ===== SISTEMA DE ORDENAMIENTO (SORT) =====
const sortSelect = document.getElementById('sortSelect');
const productsGrid = document.getElementById('productsGrid');

// Establecer valor por defecto (ya no existe "default" / "Relevancia")
sortSelect.value = 'name-az';

sortSelect.addEventListener('change', function() {
    const sortValue = this.value;
    const cards = Array.from(productsGrid.querySelectorAll('.product-card'));
    
    cards.sort((a, b) => {
        if (sortValue === 'name-az') {
            return a.dataset.title.localeCompare(b.dataset.title);
        } else if (sortValue === 'price-asc') {
            return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        } else if (sortValue === 'price-desc') {
            return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        } else if (sortValue === 'availability') {
            const availA = a.dataset.available === 'true' ? 1 : 0;
            const availB = b.dataset.available === 'true' ? 1 : 0;
            return availB - availA;
        }
        return 0;
    });
    
    cards.forEach(card => productsGrid.appendChild(card));
});

// ===== SCROLL DE CATEGORÍAS =====
const categoriesWrapper = document.querySelector('.categories-wrapper');
const scrollBtns = document.querySelectorAll('.scroll-btn');
const leftBtn = scrollBtns[0];
const rightBtn = scrollBtns[1];
const scrollAmount = 140;

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
    
    if (scrollLeft <= 5) {
        leftBtn.style.opacity = '0.3';
        leftBtn.style.pointerEvents = 'none';
    } else {
        leftBtn.style.opacity = '1';
        leftBtn.style.pointerEvents = 'auto';
    }
    
    if (scrollLeft >= maxScroll - 5) {
        rightBtn.style.opacity = '0.3';
        rightBtn.style.pointerEvents = 'none';
    } else {
        rightBtn.style.opacity = '1';
        rightBtn.style.pointerEvents = 'auto';
    }
}

categoriesWrapper.addEventListener('scroll', updateScrollButtons);
updateScrollButtons();

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

// ===== FILTRADO DE PRODUCTOS =====
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
        if (category === 'todas' || productCategory === category) {
            product.classList.remove('hidden');
            product.classList.add('fade-in');
            setTimeout(() => product.classList.remove('fade-in'), 500);
        } else {
            product.classList.add('hidden');
        }
    });
    
    document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== BOTONES DE NAVEGACIÓN =====
document.getElementById('btnProducts').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('btnGallery').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('carouselSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===== SISTEMA DE CARRITO =====
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

cartIcon.addEventListener('click', () => {
    renderCart();
    cartPanel.classList.add('active');
    panelOverlay.classList.add('active');
});

function closePanels() {
    cartPanel.classList.remove('active');
    panelOverlay.classList.remove('active');
}

panelOverlay.addEventListener('click', closePanels);
document.getElementById('closeCart').addEventListener('click', closePanels);

document.querySelectorAll('.product-add-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const productCard = this.closest('.product-card');
        const productId = productCard.dataset.id;
        const existingIndex = cart.findIndex(p => p.id === productId);
        
        if (existingIndex > -1) {
            cart.splice(existingIndex, 1);
            this.classList.remove('added');
            this.textContent = 'AÑADIR';
        } else {
            cart.push({
                id: productId,
                title: productCard.dataset.title,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image,
                available: productCard.dataset.available === 'true',
                size: productCard.dataset.size
            });
            this.classList.add('added');
            this.textContent = 'AÑADIDO';
        }
        updateBadges();
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
    
    cartItems.innerHTML = cart.map(product => `
        <div class="panel-item">
            <div class="panel-item-image"><img src="${product.image}" alt="${product.title}"></div>
            <div class="panel-item-info">
                <div class="panel-item-title">${product.title}</div>
                <div class="panel-item-availability ${product.available ? 'available' : 'out-of-stock'}">
                    ${product.available ? 'Disponible' : 'Agotado'} (Talla: ${product.size})
                </div>
                <div class="panel-item-price">$${product.price.toFixed(2)}</div>
            </div>
            <button class="panel-item-remove" onclick="removeFromCart('${product.id}')"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function removeFromCart(productId) {
    const index = cart.findIndex(p => p.id === productId);
    if (index > -1) cart.splice(index, 1);
    
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (productCard) {
        const addBtn = productCard.querySelector('.product-add-btn');
        addBtn.classList.remove('added');
        addBtn.textContent = 'AÑADIR';
    }
    updateBadges();
    renderCart();
}

btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) return;
    const productosList = cart.map(p => `• ${p.title} (Talla: ${p.size}) - ${p.available ? 'Disponible' : 'Agotado'} - $${p.price.toFixed(2)}`).join('\n');
    const total = cart.reduce((sum, p) => sum + p.price, 0);
    const mensaje = `Hola buen día, me interesaron unas piezas de tu catálogo online:\n\n${productosList}\n\nTotal: $${total.toFixed(2)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
});

updateBadges();
