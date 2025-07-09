// Global Variables
let cart = [];
let products = [];

// WhatsApp Configuration
const WHATSAPP_NUMBER = '15514305144';

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        title: 'قالب موقع إلكتروني احترافي',
        description: 'قالب HTML/CSS متجاوب ومتوافق مع جميع الأجهزة، مثالي للشركات والمؤسسات',
        price: 29.99,
        category: 'templates',
        image: 'template1.jpg',
        badge: 'الأكثر مبيعاً'
    },
    {
        id: 2,
        title: 'دورة تطوير المواقع الشاملة',
        description: 'دورة كاملة لتعلم تطوير المواقع من الصفر حتى الاحتراف',
        price: 99.99,
        category: 'courses',
        image: 'course1.jpg',
        badge: 'جديد'
    },
    {
        id: 3,
        title: 'كتاب البرمجة للمبتدئين',
        description: 'دليل شامل لتعلم البرمجة خطوة بخطوة مع أمثلة عملية',
        price: 19.99,
        category: 'ebooks',
        image: 'ebook1.jpg',
        badge: 'مميز'
    },
    {
        id: 4,
        title: 'برنامج إدارة المشاريع',
        description: 'أداة قوية لإدارة المشاريع وتتبع المهام بكفاءة عالية',
        price: 149.99,
        category: 'software',
        image: 'software1.jpg',
        badge: 'احترافي'
    },
    {
        id: 5,
        title: 'مجموعة قوالب التصميم',
        description: 'مجموعة من القوالب الجاهزة للتصميم والإعلانات',
        price: 39.99,
        category: 'templates',
        image: 'template2.jpg',
        badge: 'حزمة'
    },
    {
        id: 6,
        title: 'دورة التسويق الرقمي',
        description: 'تعلم استراتيجيات التسويق الرقمي الحديثة والفعالة',
        price: 79.99,
        category: 'courses',
        image: 'course2.jpg',
        badge: 'محدث'
    },
    {
        id: 7,
        title: 'دليل ريادة الأعمال',
        description: 'كتاب شامل عن كيفية بناء وإدارة الأعمال الناجحة',
        price: 24.99,
        category: 'ebooks',
        image: 'ebook2.jpg',
        badge: 'مفيد'
    },
    {
        id: 8,
        title: 'أداة تحليل البيانات',
        description: 'برنامج متقدم لتحليل البيانات وإنشاء التقارير',
        price: 199.99,
        category: 'software',
        image: 'software2.jpg',
        badge: 'متقدم'
    }
];

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const productsGrid = document.getElementById('products-grid');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartModal = document.getElementById('cart-modal');
const productModal = document.getElementById('product-modal');
const closeBtns = document.querySelectorAll('.close');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    products = [...sampleProducts];
    setupEventListeners();
    renderProducts(products);
    updateCartUI();
    setupSmoothScrolling();
    setupNavbarScroll();
}

// Event Listeners Setup
function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Category filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });
    
    // Cart icon click
    cartIcon.addEventListener('click', openCartModal);
    
    // Modal close buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target === cartModal || e.target === productModal) {
            closeModals();
        }
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Category Filter
function handleCategoryFilter(e) {
    const category = e.target.dataset.category;
    
    // Update active button
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter products
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    renderProducts(filteredProducts);
}

// Render Products
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <i class="fas ${getProductIcon(product.category)}"></i>
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">$${product.price}</span>
                <div class="product-actions">
                    <button class="btn-icon btn-cart" onclick="addToCart(${product.id})" title="إضافة للسلة">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    <button class="btn-icon btn-whatsapp-icon" onclick="buyNow(${product.id})" title="اشتري الآن">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add click event to open product modal
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.product-actions')) {
            openProductModal(product);
        }
    });
    
    return card;
}

// Get Product Icon based on category
function getProductIcon(category) {
    const icons = {
        'templates': 'fa-code',
        'courses': 'fa-graduation-cap',
        'ebooks': 'fa-book',
        'software': 'fa-desktop'
    };
    return icons[category] || 'fa-box';
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('تم إضافة المنتج للسلة بنجاح!', 'success');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderCartItems();
    showNotification('تم حذف المنتج من السلة', 'info');
}

// Update Cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Buy Now
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const message = createWhatsAppMessage([product]);
    openWhatsApp(message);
}

// Open Cart Modal
function openCartModal() {
    renderCartItems();
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Product Modal
function openProductModal(product) {
    document.getElementById('modal-product-title').textContent = product.title;
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('modal-product-price').textContent = `$${product.price}`;
    
    // Set up modal buttons
    document.getElementById('modal-add-to-cart').onclick = () => {
        addToCart(product.id);
        closeModals();
    };
    
    document.getElementById('modal-buy-now').onclick = () => {
        buyNow(product.id);
        closeModals();
    };
    
    productModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Modals
function closeModals() {
    cartModal.style.display = 'none';
    productModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Render Cart Items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">السلة فارغة</p>';
        cartTotalElement.textContent = '$0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>الكمية: ${item.quantity}</p>
            </div>
            <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Handle Checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('السلة فارغة!', 'warning');
        return;
    }
    
    const message = createWhatsAppMessage(cart);
    openWhatsApp(message);
    
    // Clear cart after checkout
    cart = [];
    updateCartUI();
    closeModals();
}

// Create WhatsApp Message
function createWhatsAppMessage(items) {
    let message = 'مرحباً! أريد شراء المنتجات التالية من متجر الحرية:\n\n';
    
    let total = 0;
    items.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;
        message += `📦 ${item.title}\n`;
        message += `💰 السعر: $${item.price}\n`;
        if (item.quantity && item.quantity > 1) {
            message += `🔢 الكمية: ${item.quantity}\n`;
            message += `💵 المجموع: $${itemTotal.toFixed(2)}\n`;
        }
        message += '\n';
    });
    
    message += `💳 المجموع الكلي: $${total.toFixed(2)}\n\n`;
    message += 'أرجو التواصل معي لإتمام عملية الشراء. شكراً!';
    
    return encodeURIComponent(message);
}

// Open WhatsApp
function openWhatsApp(message) {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Get Notification Icon
function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'warning': 'fa-exclamation-triangle',
        'error': 'fa-times-circle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Get Notification Color
function getNotificationColor(type) {
    const colors = {
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Setup Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}

// Setup Navbar Scroll Effect
function setupNavbarScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Intersection Observer for Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .product-card, .about-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupScrollAnimations, 500);
});

// Search Functionality (if needed in future)
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filteredProducts);
}

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('freedom-store-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('freedom-store-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Load cart from storage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
});

// Save cart to storage whenever it changes
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showNotification('تم إضافة المنتج للسلة بنجاح!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
    renderCartItems();
    showNotification('تم حذف المنتج من السلة', 'info');
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        closeModals();
    }
});

// Performance Optimization - Lazy Loading
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading);

