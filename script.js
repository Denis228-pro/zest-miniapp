// Initialize Telegram WebApp
let tg;
try {
  tg = window.Telegram.WebApp;
  tg.ready();
} catch (e) {
  console.log("Telegram WebApp not available");
}

// DOM Elements
const ageGate = document.getElementById('age-gate');
const app = document.getElementById('app');
const navLinks = document.querySelectorAll('nav a');
const pages = document.querySelectorAll('[id$="-page"]');

// Check if user has already confirmed age
document.addEventListener('DOMContentLoaded', () => {
  const ageConfirmed = localStorage.getItem('ageConfirmed');
  
  if (ageConfirmed) {
    showApp();
  }
  
  // Age gate confirmation
  document.getElementById('age-gate-confirm')?.addEventListener('click', () => {
    localStorage.setItem('ageConfirmed', 'true');
    showApp();
  });
  
  // Navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.id.replace('-link', '') + '-page';
      
      // Update active link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Show selected page
      pages.forEach(page => {
        page.classList.add('hidden');
      });
      
      document.getElementById(pageId)?.classList.remove('hidden');
      
      // Load page content
      loadPageContent(pageId);
    });
  });
  
  // Initialize catalog
  initializeCatalog();
});

// Show main app content
function showApp() {
  ageGate.style.display = 'none';
  app.classList.remove('hidden');
}

// Load page content
function loadPageContent(pageId) {
  switch(pageId) {
    case 'catalog-page':
      loadCatalog();
      break;
    case 'club-page':
      loadClubInfo();
      break;
    case 'services-page':
      // Services info is static
      break;
    case 'cart-page':
      loadCart();
      break;
    case 'profile-page':
      loadProfile();
      break;
  }
}

// Catalog functionality
function initializeCatalog() {
  const searchInput = document.getElementById('search-input');
  const brandFilter = document.getElementById('brand-filter');
  const flavorFilter = document.getElementById('flavor-filter');
  const priceFilter = document.getElementById('price-filter');
  
  // Add event listeners for filtering
  searchInput?.addEventListener('input', filterProducts);
  brandFilter?.addEventListener('change', filterProducts);
  flavorFilter?.addEventListener('change', filterProducts);
  priceFilter?.addEventListener('change', filterProducts);
}

// Load catalog data
function loadCatalog() {
  // In a real app, this would fetch from a backend
  renderProducts(getSampleProducts());
}

// Filter products based on search and filters
function filterProducts() {
  const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
  const brandValue = document.getElementById('brand-filter')?.value || '';
  const flavorValue = document.getElementById('flavor-filter')?.value || '';
  const priceValue = document.getElementById('price-filter')?.value || '';
  
  const products = getSampleProducts();
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.en.toLowerCase().includes(searchTerm) || 
                          product.name.ru.toLowerCase().includes(searchTerm);
    const matchesBrand = !brandValue || product.brand === brandValue;
    // Additional filter logic would go here
    
    return matchesSearch && matchesBrand; // Simplified for now
  });
  
  renderProducts(filteredProducts);
}

// Render products to the DOM
function renderProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <img src="${product.image_url}" alt="${product.name.en}" class="product-image">
      <div class="product-info">
        <h3>${product.name.en}</h3>
        <p>${product.description.en.substring(0, 100)}...</p>
        <div class="product-price">₽${product.retail_price}</div>
        <div class="product-actions">
          <button class="add-to-cart" data-id="${product.product_id}">Add to Cart</button>
        </div>
      </div>
    `;
    container.appendChild(productCard);
  });
  
  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.dataset.id;
      addToCart(productId);
    });
  });
}

// Shopping cart functionality
let cart = [];

function addToCart(productId) {
  // In a real app, this would add the product to the cart
  const product = getSampleProducts().find(p => p.product_id === productId);
  if (product) {
    cart.push({
      id: productId,
      name: product.name.en,
      price: product.retail_price,
      quantity: 1
    });
    
    // Show confirmation
    if (tg) {
      tg.showAlert(`Added ${product.name.en} to cart!`);
    } else {
      alert(`Added ${product.name.en} to cart!`);
    }
  }
}

function loadCart() {
  const cartContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty</p>';
    cartTotal.textContent = '0';
    return;
  }
  
  cartContainer.innerHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>₽${item.price} each</p>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-control">
          <button class="decrease-qty" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="increase-qty" data-id="${item.id}">+</button>
        </div>
        <div>₽${itemTotal}</div>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });
  
  cartTotal.textContent = total.toFixed(2);
  
  // Add event listeners for quantity controls
  document.querySelectorAll('.decrease-qty').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      updateQuantity(id, -1);
    });
  });
  
  document.querySelectorAll('.increase-qty').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      updateQuantity(id, 1);
    });
  });
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    }
    loadCart();
  }
}

// Sample data functions
function getSampleProducts() {
  return [
    {
      product_id: "1",
      name: { en: "Red Bull", ru: "Ред Булл" },
      description: { 
        en: "Red Bull is an energy drink sold by Austrian company Red Bull GmbH.", 
        ru: "Ред Булл - энергетический напиток, продаваемый австрийской компанией Red Bull GmbH." 
      },
      image_url: "https://via.placeholder.com/300x200?text=Red+Bull",
      retail_price: 150,
      supplier: "Red Bull GmbH",
      stock_count: 50,
      brand: "Red Bull",
      is_active: true
    },
    {
      product_id: "2",
      name: { en: "Monster Energy", ru: "Монстр Энерджи" },
      description: { 
        en: "Monster Energy is an energy drink introduced by Hansen Natural Corp.", 
        ru: "Монстр Энерджи - энергетический напиток, представленный компанией Hansen Natural Corp." 
      },
      image_url: "https://via.placeholder.com/300x200?text=Monster",
      retail_price: 130,
      supplier: "Hansen Natural Corp",
      stock_count: 30,
      brand: "Monster",
      is_active: true
    },
    {
      product_id: "3",
      name: { en: "Burn", ru: "Берн" },
      description: { 
        en: "Burn is a Norwegian energy drink brand founded in 1999.", 
        ru: "Берн - норвежский бренд энергетических напитков, основанный в 1999 году." 
      },
      image_url: "https://via.placeholder.com/300x200?text=Burn",
      retail_price: 100,
      supplier: "Bergans of Norway",
      stock_count: 25,
      brand: "Burn",
      is_active: true
    }
  ];
}

// Placeholder functions for other pages
function loadClubInfo() {
  // In a real app, this would check subscription status
  console.log("Loading club info");
}

function loadProfile() {
  // In a real app, this would load user profile data
  console.log("Loading profile");
}