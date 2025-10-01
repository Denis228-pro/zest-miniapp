// Product Catalog Module with Enhanced Search
class ProductCatalog {
  constructor(telegramManager) {
    this.tg = telegramManager;
    this.products = [];
    this.filteredProducts = [];
    this.filters = {
      search: '',
      brand: '',
      flavor: '',
      priceRange: ''
    };
  }

  // Initialize the catalog with sample data
  init() {
    this.products = this.getSampleProducts();
    this.filteredProducts = [...this.products];
  }

  // Enhanced search function with fuzzy matching
  searchProducts(query) {
    if (!query) {
      this.filteredProducts = [...this.products];
      return this.filteredProducts;
    }

    const searchTerm = query.toLowerCase();
    this.filteredProducts = this.products.filter(product => {
      // Direct match
      if (product.name.ru.toLowerCase().includes(searchTerm) || 
          product.name.en.toLowerCase().includes(searchTerm) ||
          product.description.ru.toLowerCase().includes(searchTerm) ||
          product.description.en.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Fuzzy match (simple implementation)
      const productText = `${product.name.ru} ${product.name.en} ${product.description.ru} ${product.description.en}`.toLowerCase();
      return this.fuzzyMatch(searchTerm, productText);
    });

    return this.filteredProducts;
  }

  // Simple fuzzy matching algorithm
  fuzzyMatch(searchTerm, text) {
    // Check if all characters in searchTerm appear in order in text
    let searchIndex = 0;
    for (let i = 0; i < text.length; i++) {
      if (searchIndex < searchTerm.length && text[i] === searchTerm[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === searchTerm.length;
  }

  // Apply filters
  applyFilters(filters) {
    this.filters = { ...this.filters, ...filters };
    
    this.filteredProducts = this.products.filter(product => {
      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        if (!(product.name.ru.toLowerCase().includes(searchTerm) || 
              product.name.en.toLowerCase().includes(searchTerm) ||
              product.description.ru.toLowerCase().includes(searchTerm) ||
              product.description.en.toLowerCase().includes(searchTerm))) {
          // Try fuzzy match
          const productText = `${product.name.ru} ${product.name.en} ${product.description.ru} ${product.description.en}`.toLowerCase();
          if (!this.fuzzyMatch(searchTerm, productText)) {
            return false;
          }
        }
      }

      // Brand filter
      if (this.filters.brand && product.brand !== this.filters.brand) {
        return false;
      }

      // Flavor filter (simplified)
      if (this.filters.flavor) {
        // In a real app, products would have flavor properties
        // This is just a placeholder
      }

      // Price range filter
      if (this.filters.priceRange) {
        const [min, max] = this.filters.priceRange.split('-').map(Number);
        if (max && (product.retail_price < min || product.retail_price > max)) {
          return false;
        } else if (!max && product.retail_price < min) {
          return false;
        }
      }

      return true;
    });

    return this.filteredProducts;
  }

  // Get unique brands for filter dropdown
  getBrands() {
    const brands = [...new Set(this.products.map(p => p.brand))];
    return brands;
  }

  // Get unique flavors for filter dropdown
  getFlavors() {
    // In a real app, this would extract flavors from products
    return ['Original', 'Zero', 'Tropical', 'Berry', 'Citrus'];
  }

  // Get products
  getProducts() {
    return [...this.filteredProducts];
  }

  // Get sample products
  getSampleProducts() {
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
        is_active: true,
        flavors: ["Original", "Sugarfree", "Tropical"],
        volume: "250ml"
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
        is_active: true,
        flavors: ["Original", "Zero", "Mango"],
        volume: "500ml"
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
        is_active: true,
        flavors: ["Original", "Berry", "Citrus"],
        volume: "250ml"
      },
      {
        product_id: "4",
        name: { en: "Adrenaline", ru: "Адреналин" },
        description: { 
          en: "Adrenaline is a strong energy drink with guarana extract.", 
          ru: "Адреналин - крепкий энергетический напиток с экстрактом guarana." 
        },
        image_url: "https://via.placeholder.com/300x200?text=Adrenaline",
        retail_price: 80,
        supplier: "Local Producer",
        stock_count: 40,
        brand: "Local",
        is_active: true,
        flavors: ["Original", "Tropical"],
        volume: "300ml"
      },
      {
        product_id: "5",
        name: { en: "Flash", ru: "Флэш" },
        description: { 
          en: "Flash energy drink with vitamins and caffeine.", 
          ru: "Энергетический напиток Флэш с витаминами и кофеином." 
        },
        image_url: "https://via.placeholder.com/300x200?text=Flash",
        retail_price: 90,
        supplier: "Local Producer",
        stock_count: 35,
        brand: "Local",
        is_active: true,
        flavors: ["Original", "Berry", "Citrus"],
        volume: "250ml"
      }
    ];
  }
}

// Export as a module
window.ProductCatalog = ProductCatalog;