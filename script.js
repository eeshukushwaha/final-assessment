// Global State
let productsData = [];
let cartCount = 0;

// DOM Elements
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortOption = document.getElementById('sortOption');
const cartCountBadge = document.getElementById('cart-count');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');

// Modal Elements
const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalRating = document.getElementById('modalRating');

/**
 * Task 1 & 7: Fetch Data from API and Handle Errors
 */
async function initializeDashboard() {
    toggleLoader(true);
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        productsData = await response.json();
        
        extractCategories(productsData);
        renderProducts(productsData);
    } catch (error) {
        showError("Could not load products. Please check your network connection and try again.");
    } finally {
        toggleLoader(false);
    }
}

/**
 * Task 1 & 8 & 9: Render Products to Bootstrap Grid
 */
function renderProducts(productsToRender) {
    productList.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productList.innerHTML = '<div class="col-12 text-center text-muted mt-4"><p>No products match your criteria.</p></div>';
        return;
    }

    productsToRender.forEach(product => {
        const productCol = document.createElement('div');
        // Responsive grid sizes
        productCol.className = 'col-12 col-sm-6 col-md-4 col-lg-3'; 
        
        productCol.innerHTML = `
            <div class="card product-card shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-dark" title="${product.title}">${product.title}</h5>
                    <p class="card-text text-muted small text-capitalize mb-1">${product.category}</p>
                    <h5 class="text-success fw-bold mb-3">$${product.price.toFixed(2)}</h5>
                    <div class="mt-auto d-grid gap-2">
                        <button class="btn btn-outline-secondary btn-sm" onclick="viewProductDetails(${product.id})">View Details</button>
                        <button class="btn btn-primary btn-sm" onclick="addToCart(event)">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productCol);
    });
}

/**
 * Task 2: Dynamically Extract Categories
 */
function extractCategories(data) {
    const categories = [...new Set(data.map(item => item.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}

/**
 * Task 2, 3, 5: Combined Filter and Sort Logic
 */
function applyFiltersAndSort() {
    let filteredList = [...productsData];

    // 1. Search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredList = filteredList.filter(p => p.title.toLowerCase().includes(searchTerm));
    }

    // 2. Category filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== 'all') {
        filteredList = filteredList.filter(p => p.category === selectedCategory);
    }

    // 3. Sorting
    const sortValue = sortOption.value;
    if (sortValue === 'lowToHigh') {
        filteredList.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'highToLow') {
        filteredList.sort((a, b) => b.price - a.price);
    }

    renderProducts(filteredList);
}

/**
 * Task 4: View Product Details (Modal)
 */
function viewProductDetails(id) {
    const product = productsData.find(p => p.id === id);
    if (product) {
        modalTitle.textContent = product.title;
        modalImage.src = product.image;
        modalDescription.textContent = product.description;
        modalPrice.textContent = `$${product.price.toFixed(2)}`;
        modalRating.textContent = `${product.rating.rate} (${product.rating.count} reviews)`;
        productModal.show();
    }
}

/**
 * Task 6: Add to Cart functionality (UI Only)
 */
function addToCart(event) {
    if (event) {
        event.stopPropagation(); // Prevents clicking the card background
    }
    cartCount++;
    cartCountBadge.textContent = cartCount;
}

/**
 * Task 7: UI Feedback Handlers (Loader & Error)
 */
function toggleLoader(isVisible) {
    if (isVisible) {
        loader.classList.remove('d-none');
    } else {
        loader.classList.add('d-none');
    }
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('d-none');
}

// Event Listeners for User Interactions
searchInput.addEventListener('input', applyFiltersAndSort);
categoryFilter.addEventListener('change', applyFiltersAndSort);
sortOption.addEventListener('change', applyFiltersAndSort);

// Bootstrap Initialization
initializeDashboard();