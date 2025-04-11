/**
 * Main JS file for Shanghai Xiongji Material Co., Ltd. Website
 * Handles initialization of page-specific functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize page-specific functionality
    initPageFunctionality();
  });
  
  /**
   * Initialize mobile menu functionality
   */
  function initMobileMenu() {
    const menuButton = document.querySelector('button.mobile-menu-button');
    const mobileMenu = document.querySelector('nav.mobile-menu');
    
    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
      });
    }
  }
  
  /**
   * Initialize page-specific functionality based on current page
   */
  function initPageFunctionality() {
    // Get current page path
    const path = window.location.pathname;
    
    // Home page
    if (path === '/' || path === '/index.html') {
      initHomePage();
    }
    // Products pages
    else if (path === '/products.html' || path.startsWith('/products/')) {
      initProductsPage();
    }
    // Projects pages
    else if (path === '/projects.html' || path.startsWith('/projects/')) {
      initProjectsPage();
    }
    // Blog pages
    else if (path === '/blog.html' || path.startsWith('/blog/')) {
      initBlogPage();
    }
    // Contact page
    else if (path === '/contact.html') {
      initContactPage();
    }
  }
  
  /**
   * Initialize home page functionality
   */
  function initHomePage() {
    // Featured products section
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer && window.XiongjiData && window.XiongjiData.Products) {
      window.XiongjiData.Products.displayCategories(featuredProductsContainer);
    }
    
    // Featured projects section
    const featuredProjectsContainer = document.getElementById('featured-projects');
    if (featuredProjectsContainer && window.XiongjiData && window.XiongjiData.Projects) {
      window.XiongjiData.Projects.displayProjects(featuredProjectsContainer, null, 3);
    }
    
    // Latest articles section
    const latestArticlesContainer = document.getElementById('latest-articles');
    if (latestArticlesContainer && window.XiongjiData && window.XiongjiData.Articles) {
      window.XiongjiData.Articles.displayArticles(latestArticlesContainer, { limit: 3 });
    }
  }
  
  /**
   * Initialize products page functionality
   */
  function initProductsPage() {
    const path = window.location.pathname;
    
    // Main products page
    if (path === '/products.html') {
      const productsContainer = document.getElementById('products-container');
      if (productsContainer && window.XiongjiData && window.XiongjiData.Products) {
        window.XiongjiData.Products.displayCategories(productsContainer);
      }
    }
    // Product category page
    else if (path.match(/^\/products\/[^\/]+\.html$/)) {
      const categoryId = path.split('/')[2].replace('.html', '');
      const categoryContainer = document.getElementById('category-container');
      
      if (categoryContainer && window.XiongjiData && window.XiongjiData.Products) {
        window.XiongjiData.Products.displayCategory(categoryContainer, categoryId);
      }
    }
    // Individual product page
    else if (path.match(/^\/products\/[^\/]+\/[^\/]+\.html$/)) {
      const pathParts = path.split('/');
      const categoryId = pathParts[2];
      const productId = pathParts[3].replace('.html', '');
      const productContainer = document.getElementById('product-container');
      
      if (productContainer && window.XiongjiData && window.XiongjiData.Products) {
        window.XiongjiData.Products.displayProduct(productContainer, categoryId, productId);
      }
    }
  }
  
  /**
   * Initialize projects page functionality
   */
  function initProjectsPage() {
    const path = window.location.pathname;
    
    // Main projects page
    if (path === '/projects.html') {
      const projectsContainer = document.getElementById('projects-container');
      
      if (projectsContainer && window.XiongjiData && window.XiongjiData.Projects) {
        // Check for category filter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('category');
        
        window.XiongjiData.Projects.displayProjects(projectsContainer, categoryFilter);
      }
    }
    // Individual project page
    else if (path.match(/^\/projects\/[^\/]+\.html$/)) {
      const projectId = path.split('/')[2].replace('.html', '');
      const projectContainer = document.getElementById('project-container');
      
      if (projectContainer && window.XiongjiData && window.XiongjiData.Projects) {
        window.XiongjiData.Projects.displayProject(projectContainer, projectId);
      }
    }
  }
  
  /**
   * Initialize blog page functionality
   */
  function initBlogPage() {
    const path = window.location.pathname;
    
    // Main blog page
    if (path === '/blog.html') {
      const articlesContainer = document.getElementById('articles-container');
      
      if (articlesContainer && window.XiongjiData && window.XiongjiData.Articles) {
        // Check for category or tag filter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('category');
        const tagFilter = urlParams.get('tag');
        
        window.XiongjiData.Articles.displayArticles(articlesContainer, {
          categoryFilter: categoryFilter,
          tagFilter: tagFilter
        });
      }
    }
    // Individual article page
    else if (path.match(/^\/blog\/[^\/]+\.html$/)) {
      const articleSlug = path.split('/')[2].replace('.html', '');
      const articleContainer = document.getElementById('article-container');
      
      if (articleContainer && window.XiongjiData && window.XiongjiData.Articles) {
        // Find article by slug
        window.XiongjiData.Articles.loadArticles().then(articles => {
          const article = articles.find(a => a.slug === articleSlug);
          if (article) {
            window.XiongjiData.Articles.displayArticle(articleContainer, article.id);
          } else {
            articleContainer.innerHTML = '<div class="text-center py-12"><h2 class="text-2xl font-bold text-gray-700">Article not found</h2></div>';
          }
        });
      }
    }
  }
  
  /**
   * Initialize contact page functionality
   */
  function initContactPage() {
    // Pre-fill product inquiry if specified in URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (productId) {
      const subjectField = document.getElementById('inquiry-subject');
      const messageField = document.getElementById('inquiry-message');
      
      if (subjectField) {
        subjectField.value = `Inquiry about ${productId.replace(/-/g, ' ')}`;
      }
      
      if (messageField) {
        messageField.value = `I would like to request information about your ${productId.replace(/-/g, ' ')} product. Please provide details on:
  
  - Specifications and available options
  - Pricing and minimum order quantity
  - Lead time and shipping options
  - Technical documentation
  
  Thank you.`;
      }
    }
    
    // Form validation and submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Simple validation
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('inquiry-message').value;
        
        if (!name || !email || !message) {
          alert('Please fill in all required fields.');
          return;
        }
        
        // In a real implementation, you would send the form data to your server
        // For this example, we'll simulate a successful submission
        const formContainer = document.getElementById('form-container');
        const successMessage = document.getElementById('success-message');
        
        if (formContainer && successMessage) {
          formContainer.classList.add('hidden');
          successMessage.classList.remove('hidden');
        }
      });
    }
  }