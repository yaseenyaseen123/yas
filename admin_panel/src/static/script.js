// Global Variables
let currentPage = 'dashboard';
let products = [];
let orders = [];

// API Base URL
const API_BASE = '/api';

// DOM Elements
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const sidebarToggle = document.getElementById('sidebar-toggle');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const pageTitle = document.getElementById('page-title');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadDashboardData();
    showPage('dashboard');
}

// Event Listeners Setup
function setupEventListeners() {
    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);
    mobileMenuToggle.addEventListener('click', toggleMobileSidebar);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            showPage(page);
            
            // Close mobile sidebar
            sidebar.classList.remove('mobile-open');
        });
    });
    
    // Product form submission
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

// Sidebar Functions
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
}

function toggleMobileSidebar() {
    sidebar.classList.toggle('mobile-open');
}

// Page Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`${pageName}-page`).classList.add('active');
    
    // Update navigation
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'لوحة القيادة',
        'products': 'إدارة المنتجات',
        'orders': 'إدارة الطلبات',
        'settings': 'الإعدادات'
    };
    pageTitle.textContent = titles[pageName];
    
    currentPage = pageName;
    
    // Load page data
    switch(pageName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
    }
}

// API Functions
async function apiRequest(endpoint, options = {}) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        hideLoading();
        return data;
    } catch (error) {
        hideLoading();
        console.error('API Error:', error);
        showToast('حدث خطأ في الاتصال بالخادم', 'error');
        throw error;
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        // Load products count
        const productsData = await apiRequest('/products');
        document.getElementById('total-products').textContent = productsData.length;
        
        // Load orders stats
        const ordersStats = await apiRequest('/orders/stats');
        document.getElementById('total-orders').textContent = ordersStats.total_orders;
        document.getElementById('pending-orders').textContent = ordersStats.pending_orders;
        document.getElementById('total-revenue').textContent = `$${ordersStats.total_revenue.toFixed(2)}`;
        
        // Load recent orders
        const ordersData = await apiRequest('/orders');
        renderRecentOrders(ordersData.slice(0, 5));
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function renderRecentOrders(orders) {
    const tbody = document.querySelector('#recent-orders-table tbody');
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">لا توجد طلبات</td></tr>';
        return;
    }
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer_name}</td>
            <td>$${order.total_price.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${formatDate(order.created_at)}</td>
        `;
        tbody.appendChild(row);
    });
}

async function refreshDashboard() {
    showToast('جاري تحديث البيانات...', 'info');
    await loadDashboardData();
    showToast('تم تحديث البيانات بنجاح', 'success');
}

async function seedData() {
    try {
        showLoading();
        
        // Seed products
        await apiRequest('/seed-products', { method: 'POST' });
        
        // Seed orders
        await apiRequest('/seed-orders', { method: 'POST' });
        
        hideLoading();
        showToast('تم إضافة البيانات التجريبية بنجاح', 'success');
        
        // Refresh dashboard
        await loadDashboardData();
        
    } catch (error) {
        console.error('Error seeding data:', error);
        showToast('حدث خطأ أثناء إضافة البيانات', 'error');
    }
}

// Products Functions
async function loadProducts() {
    try {
        const data = await apiRequest('/products');
        products = data;
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProducts(productsToRender) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        grid.innerHTML = '<div class="text-center"><p>لا توجد منتجات. <button class="btn btn-primary" onclick="showAddProductModal()">إضافة منتج جديد</button></p></div>';
        return;
    }
    
    productsToRender.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-header">
            <i class="fas ${getProductIcon(product.category)}"></i>
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">$${product.price}</span>
                <div class="product-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
}

function getProductIcon(category) {
    const icons = {
        'templates': 'fa-code',
        'courses': 'fa-graduation-cap',
        'ebooks': 'fa-book',
        'software': 'fa-desktop'
    };
    return icons[category] || 'fa-box';
}

function showAddProductModal() {
    document.getElementById('modal-title').textContent = 'إضافة منتج جديد';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    showModal('product-modal');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modal-title').textContent = 'تعديل المنتج';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-title').value = product.title;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-badge').value = product.badge || '';
    
    showModal('product-modal');
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('product-title').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        badge: document.getElementById('product-badge').value
    };
    
    const productId = document.getElementById('product-id').value;
    
    try {
        if (productId) {
            // Update existing product
            await apiRequest(`/products/${productId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showToast('تم تحديث المنتج بنجاح', 'success');
        } else {
            // Create new product
            await apiRequest('/products', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showToast('تم إضافة المنتج بنجاح', 'success');
        }
        
        closeModal('product-modal');
        loadProducts();
        
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('حدث خطأ أثناء حفظ المنتج', 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        return;
    }
    
    try {
        await apiRequest(`/products/${productId}`, { method: 'DELETE' });
        showToast('تم حذف المنتج بنجاح', 'success');
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('حدث خطأ أثناء حذف المنتج', 'error');
    }
}

// Orders Functions
async function loadOrders() {
    try {
        const data = await apiRequest('/orders');
        orders = data;
        renderOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function renderOrders(ordersToRender) {
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';
    
    if (ordersToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">لا توجد طلبات</td></tr>';
        return;
    }
    
    ordersToRender.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${order.customer_whatsapp}</td>
            <td>${order.products.length} منتج</td>
            <td>$${order.total_price.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${formatDate(order.created_at)}</td>
            <td>
                <select onchange="updateOrderStatus(${order.id}, this.value)" class="btn btn-sm">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد المعالجة</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>مكتمل</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغى</option>
                </select>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await apiRequest(`/orders/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        showToast('تم تحديث حالة الطلب بنجاح', 'success');
        loadOrders();
    } catch (error) {
        console.error('Error updating order status:', error);
        showToast('حدث خطأ أثناء تحديث حالة الطلب', 'error');
    }
}

function filterOrders() {
    const statusFilter = document.getElementById('status-filter').value;
    
    let filteredOrders = orders;
    if (statusFilter) {
        filteredOrders = orders.filter(order => order.status === statusFilter);
    }
    
    renderOrders(filteredOrders);
}

// Utility Functions
function getStatusText(status) {
    const statusTexts = {
        'pending': 'قيد المعالجة',
        'completed': 'مكتمل',
        'cancelled': 'ملغى'
    };
    return statusTexts[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Modal Functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Loading Functions
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-in-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'warning': 'fa-exclamation-triangle',
        'error': 'fa-times-circle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Add CSS for toast slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                closeModal(modal.id);
            }
        });
    }
    
    // Quick navigation with Ctrl + number keys
    if (e.ctrlKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showPage('dashboard');
                break;
            case '2':
                e.preventDefault();
                showPage('products');
                break;
            case '3':
                e.preventDefault();
                showPage('orders');
                break;
            case '4':
                e.preventDefault();
                showPage('settings');
                break;
        }
    }
});

// Auto-refresh dashboard every 5 minutes
setInterval(() => {
    if (currentPage === 'dashboard') {
        loadDashboardData();
    }
}, 5 * 60 * 1000);

