/**
 * Data Loader for Shanghai Xiongji Material Co., Ltd. Website
 * Handles loading and displaying JSON data for products, projects, and articles
 */

// Configuration
const CONFIG = {
    dataPath: '/data/', // Path to JSON data files
    imageBasePath: '/', // Base path for images
    defaultErrorMessage: 'Failed to load content. Please try again later.'
  };
  
  /**
   * Load JSON data from file
   * @param {string} filename - Name of the JSON file to load
   * @returns {Promise} - Promise resolving to the parsed JSON data
   */
  async function loadJsonData(filename) {
    try {
      const response = await fetch(`${CONFIG.dataPath}${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw error;
    }
  }
  
  /**
   * Display error message in the specified container
   * @param {Element} container - Container element to show error in
   * @param {string} message - Error message to display
   */
  function displayError(container, message = CONFIG.defaultErrorMessage) {
    container.innerHTML = `
      <div class="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">${message}</p>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Products Module - Handles loading and displaying product data
   */
  const ProductsModule = {
    /**
     * Load all product categories
     * @returns {Promise} - Promise resolving to product categories data
     */
    async loadCategories() {
      try {
        const data = await loadJsonData('products.json');
        return data.categories || [];
      } catch (error) {
        return [];
      }
    },
  
    /**
     * Find a specific product category by ID
     * @param {string} categoryId - ID of the category to find
     * @returns {Promise} - Promise resolving to the category object or null
     */
    async getCategory(categoryId) {
      try {
        const categories = await this.loadCategories();
        return categories.find(category => category.id === categoryId) || null;
      } catch (error) {
        return null;
      }
    },
  
    /**
     * Find a specific product by ID within a category
     * @param {string} categoryId - ID of the category
     * @param {string} productId - ID of the product to find
     * @returns {Promise} - Promise resolving to the product object or null
     */
    async getProduct(categoryId, productId) {
      try {
        const category = await this.getCategory(categoryId);
        if (!category || !category.products) return null;
        return category.products.find(product => product.id === productId) || null;
      } catch (error) {
        return null;
      }
    },
  
    /**
     * Display product categories in the specified container
     * @param {Element} container - Container element for displaying categories
     */
    async displayCategories(container) {
      try {
        const categories = await this.loadCategories();
        if (!categories.length) {
          throw new Error('No product categories found');
        }
  
        let html = '<div class="grid grid-cols-1 md:grid-cols-3 gap-8">';
  
        categories.forEach(category => {
          html += `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="${CONFIG.imageBasePath}${category.image}" alt="${category.name}" class="w-full h-48 object-cover">
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2">${category.name}</h3>
                <p class="text-gray-700 mb-4">${category.description}</p>
                <a href="products/${category.id}.html" class="inline-block text-blue-600 hover:underline">View Products →</a>
              </div>
            </div>
          `;
        });
  
        html += '</div>';
        container.innerHTML = html;
      } catch (error) {
        displayError(container, 'Unable to load product categories.');
      }
    },
  
    /**
     * Display a single product category with its products
     * @param {Element} container - Container element for displaying the category
     * @param {string} categoryId - ID of the category to display
     */
    async displayCategory(container, categoryId) {
      try {
        const category = await this.getCategory(categoryId);
        if (!category) {
          throw new Error(`Category ${categoryId} not found`);
        }
  
        let html = `
          <div class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">${category.name}</h1>
            <p class="text-lg">${category.description}</p>
          </div>
        `;
  
        if (category.overview) {
          html += `
            <div class="mb-8">
              <h2 class="text-2xl font-bold mb-4">Overview</h2>
              <p class="text-gray-700">${category.overview}</p>
            </div>
          `;
        }
  
        if (category.advantages && category.advantages.length) {
          html += `
            <div class="bg-gray-100 p-6 rounded-lg mt-8 mb-8">
              <h3 class="text-xl font-bold mb-4">Key Advantages</h3>
              <ul class="space-y-2">
          `;
          
          category.advantages.forEach(advantage => {
            html += `
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-600 mt-1 mr-2"></i>
                <span>${advantage}</span>
              </li>
            `;
          });
          
          html += `
              </ul>
            </div>
          `;
        }
  
        if (category.products && category.products.length) {
          html += `
            <h2 class="text-2xl font-bold mb-6">Products</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          `;
          
          category.products.forEach(product => {
            html += `
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="${CONFIG.imageBasePath}${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                  <h3 class="text-xl font-bold mb-2">${product.name}</h3>
                  <p class="text-gray-700 mb-4">${product.description}</p>
                  <a href="products/${categoryId}/${product.id}.html" class="inline-block text-blue-600 hover:underline">View Details →</a>
                </div>
              </div>
            `;
          });
          
          html += '</div>';
        }
  
        container.innerHTML = html;
      } catch (error) {
        displayError(container, `Unable to load product category: ${categoryId}`);
      }
    },
  
    /**
     * Display a single product with detailed information
     * @param {Element} container - Container element for displaying the product
     * @param {string} categoryId - ID of the product's category
     * @param {string} productId - ID of the product to display
     */
    async displayProduct(container, categoryId, productId) {
      try {
        const product = await this.getProduct(categoryId, productId);
        const category = await this.getCategory(categoryId);
        
        if (!product || !category) {
          throw new Error(`Product ${productId} not found`);
        }
  
        let html = `
          <div class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">${product.name}</h1>
            <p class="text-lg">${product.description}</p>
          </div>
  
          <div class="flex flex-col md:flex-row mb-12">
            <div class="md:w-1/2 mb-6 md:mb-0 md:pr-6">
              <img src="${CONFIG.imageBasePath}${product.image}" alt="${product.name}" class="w-full h-auto rounded-lg shadow-lg">
            </div>
            <div class="md:w-1/2">
              <h2 class="text-2xl font-bold mb-4">Specifications</h2>
        `;
  
        if (product.specifications) {
          html += '<ul class="space-y-2">';
          for (const [key, value] of Object.entries(product.specifications)) {
            html += `
              <li><span class="font-medium">${key}:</span> ${value}</li>
            `;
          }
          html += '</ul>';
        }
  
        html += `
              <div class="mt-8">
                <a href="/contact.html?product=${productId}" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">Request Quote</a>
              </div>
            </div>
          </div>
        `;
  
        container.innerHTML = html;
      } catch (error) {
        displayError(container, `Unable to load product: ${productId}`);
      }
    }
  };
  
  /**
   * Projects Module - Handles loading and displaying project data
   */
  const ProjectsModule = {
    /**
     * Load all projects
     * @returns {Promise} - Promise resolving to projects data
     */
    async loadProjects() {
      try {
        const data = await loadJsonData('projects.json');
        return data.projects || [];
      } catch (error) {
        return [];
      }
    },
  
    /**
     * Load project categories
     * @returns {Promise} - Promise resolving to project categories
     */
    async loadCategories() {
      try {
        const data = await loadJsonData('projects.json');
        return data.categories || [];
      } catch (error) {
        return [];
      }
    },
  
    /**
     * Find a specific project by ID
     * @param {string} projectId - ID of the project to find
     * @returns {Promise} - Promise resolving to the project object or null
     */
    async getProject(projectId) {
      try {
        const projects = await this.loadProjects();
        return projects.find(project => project.id === projectId) || null;
      } catch (error) {
        return null;
      }
    },
  
    /**
     * Display all projects in the specified container
     * @param {Element} container - Container element for displaying projects
     * @param {string} [categoryFilter] - Optional category to filter by
     */
    async displayProjects(container, categoryFilter = null) {
      try {
        const projects = await this.loadProjects();
        const categories = await this.loadCategories();
        
        if (!projects.length) {
          throw new Error('No projects found');
        }
  
        let filteredProjects = projects;
        if (categoryFilter) {
          filteredProjects = projects.filter(project => project.category.toLowerCase() === categoryFilter.toLowerCase());
        }
  
        // Create category filter buttons
        let html = '<div class="mb-8">';
        html += `<button class="mr-2 mb-2 px-4 py-2 rounded ${!categoryFilter ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}" data-category="all">All Projects</button>`;
        
        categories.forEach(category => {
          const isActive = categoryFilter === category.id;
          html += `
            <button class="mr-2 mb-2 px-4 py-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}" data-category="${category.id}">
              ${category.name}
            </button>
          `;
        });
        
        html += '</div>';
  
        // Display projects
        html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">';
        
        filteredProjects.forEach(project => {
          html += `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="${CONFIG.imageBasePath}${project.featuredImage}" alt="${project.title}" class="w-full h-48 object-cover">
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                <p class="text-gray-500 mb-2">${project.location} | ${project.year}</p>
                <p class="text-gray-700 mb-4">${project.description}</p>
                <a href="projects/${project.id}.html" class="inline-block text-blue-600 hover:underline">View Case Study →</a>
              </div>
            </div>
          `;
        });
        
        html += '</div>';
        container.innerHTML = html;
  
        // Add event listeners to filter buttons
        const filterButtons = container.querySelectorAll('button[data-category]');
        filterButtons.forEach(button => {
          button.addEventListener('click', () => {
            const category = button.dataset.category;
            if (category === 'all') {
              this.displayProjects(container, null);
            } else {
              this.displayProjects(container, category);
            }
          });
        });
      } catch (error) {
        displayError(container, 'Unable to load projects.');
      }
    },
  
    /**
     * Display a single project with detailed information
     * @param {Element} container - Container element for displaying the project
     * @param {string} projectId - ID of the project to display
     */
    async displayProject(container, projectId) {
      try {
        const project = await this.getProject(projectId);
        
        if (!project) {
          throw new Error(`Project ${projectId} not found`);
        }
  
        let html = `
          <div class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">${project.title}</h1>
            <p class="text-gray-600 mb-6">${project.location} | ${project.year} | ${project.category}</p>
          </div>
  
          <!-- Project Gallery -->
          <div class="mb-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-3">
                <img src="${CONFIG.imageBasePath}${project.featuredImage}" alt="${project.title}" class="w-full h-auto rounded-lg shadow-lg">
              </div>
        `;
  
        if (project.images && project.images.length) {
          project.images.forEach(image => {
            html += `
              <div>
                <img src="${CONFIG.imageBasePath}${image}" alt="${project.title}" class="w-full h-auto rounded-lg shadow-lg">
              </div>
            `;
          });
        }
  
        html += `
            </div>
          </div>
  
          <!-- Project Details -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div class="md:col-span-2">
              <h2 class="text-2xl font-bold mb-4">Project Overview</h2>
              <p class="text-gray-700 mb-6">${project.description}</p>
  
              <h3 class="text-xl font-bold mb-3">Challenge</h3>
              <p class="text-gray-700 mb-6">${project.challengeDescription}</p>
  
              <h3 class="text-xl font-bold mb-3">Solution</h3>
              <p class="text-gray-700 mb-6">${project.solutionDescription}</p>
  
              <h3 class="text-xl font-bold mb-3">Results</h3>
              <ul class="list-disc ml-6 mb-6 space-y-2">
        `;
  
        if (project.results && project.results.length) {
          project.results.forEach(result => {
            html += `<li>${result}</li>`;
          });
        }
  
        html += `
              </ul>
            </div>
  
            <div>
              <div class="bg-gray-100 p-6 rounded-lg mb-6">
                <h3 class="text-xl font-bold mb-3">Project Details</h3>
                <ul class="space-y-2">
                  <li><span class="font-medium">Client:</span> ${project.client}</li>
                  <li><span class="font-medium">Location:</span> ${project.location}</li>
                  <li><span class="font-medium">Year:</span> ${project.year}</li>
                  <li><span class="font-medium">Category:</span> ${project.category}</li>
                </ul>
              </div>
  
              <div class="bg-gray-100 p-6 rounded-lg">
                <h3 class="text-xl font-bold mb-3">Products Used</h3>
                <ul class="list-disc ml-6 space-y-1">
        `;
  
        if (project.products && project.products.length) {
          project.products.forEach(product => {
            html += `<li>${product}</li>`;
          });
        }
  
        html += `
                </ul>
              </div>
            </div>
          </div>
        `;
  
        // Testimonial section (if available)
        if (project.testimonial) {
          html += `
            <div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
              <div class="italic text-gray-700 mb-4">"${project.testimonial.quote}"</div>
              <div>
                <span class="font-bold">${project.testimonial.author}</span><br>
                <span class="text-gray-600">${project.testimonial.position}, ${project.testimonial.company}</span>
              </div>
            </div>
          `;
        }
  
        html += `
          <div class="mt-8">
            <a href="/projects.html" class="text-blue-600 hover:underline">← Back to Projects</a>
          </div>
        `;
  
        container.innerHTML = html;
      } catch (error) {
        displayError(container, `Unable to load project: ${projectId}`);
      }
    }
  };
  
  /**
   * Articles Module - Handles loading and displaying blog articles
   */
  const ArticlesModule = {
    /**
     * Load all articles
     * @returns {Promise} - Promise resolving to articles data
     */
    async loadArticles() {
      try {
        const data = await loadJsonData('articles.json');
        return data.articles || [];
      } catch (error) {
        return [];
      }
    },
  
    /**
     * Load article categories
     * @returns {Promise} - Promise resolving to article categories
     */
    async loadCategories() {
      try {
        const data = await loadJsonData('articles.json');
        return data.categories || [];
      } catch (error) {
        return [];
      }
    },
  
    /**
     * Load article tags
     * @returns {Promise} - Promise resolving to article tags
     */
    async loadTags() {
      try {
        const data = await loadJsonData('articles.json');
        return data.tags || [];
      } catch (error) {
        return [];
      }
    },
  
    /**
     * Find a specific article by ID
     * @param {string} articleId - ID of the article to find
     * @returns {Promise} - Promise resolving to the article object or null
     */
    async getArticle(articleId) {
      try {
        const articles = await this.loadArticles();
        return articles.find(article => article.id === articleId) || null;
      } catch (error) {
        return null;
      }
    },
  
    /**
     * Display all articles in the specified container
     * @param {Element} container - Container element for displaying articles
     * @param {object} [options] - Optional display options
     * @param {string} [options.categoryFilter] - Filter articles by category
     * @param {string} [options.tagFilter] - Filter articles by tag
     * @param {number} [options.limit] - Limit number of articles displayed
     */
    async displayArticles(container, options = {}) {
      try {
        const articles = await this.loadArticles();
        const categories = await this.loadCategories();
        
        if (!articles.length) {
          throw new Error('No articles found');
        }
  
        let filteredArticles = articles;
        
        // Apply category filter if specified
        if (options.categoryFilter) {
          filteredArticles = filteredArticles.filter(article => 
            article.categories.some(category => 
              category.toLowerCase() === options.categoryFilter.toLowerCase()
            )
          );
        }
        
        // Apply tag filter if specified
        if (options.tagFilter) {
          filteredArticles = filteredArticles.filter(article => 
            article.tags.some(tag => 
              tag.toLowerCase() === options.tagFilter.toLowerCase()
            )
          );
        }
        
        // Apply limit if specified
        if (options.limit && !isNaN(options.limit)) {
          filteredArticles = filteredArticles.slice(0, parseInt(options.limit));
        }
  
        // Create category filter buttons if not in limited display mode
        let html = '';
        if (!options.limit) {
          html += '<div class="mb-8">';
          html += `<button class="mr-2 mb-2 px-4 py-2 rounded ${!options.categoryFilter ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}" data-category="all">All Articles</button>`;
          
          categories.forEach(category => {
            const isActive = options.categoryFilter === category.id;
            html += `
              <button class="mr-2 mb-2 px-4 py-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}" data-category="${category.id}">
                ${category.name}
              </button>
            `;
          });
          
          html += '</div>';
        }
  
        // Display articles
        html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">';
        
        filteredArticles.forEach(article => {
          html += `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="${CONFIG.imageBasePath}${article.featuredImage}" alt="${article.title}" class="w-full h-48 object-cover">
              <div class="p-6">
                <span class="text-sm text-gray-500">${article.date}</span>
                <h3 class="text-xl font-bold mb-2 mt-1">${article.title}</h3>
                <p class="text-gray-700 mb-4">${article.summary}</p>
                <a href="blog/${article.slug}.html" class="inline-block text-blue-600 hover:underline">Read More →</a>
              </div>
            </div>
          `;
        });
        
        html += '</div>';
        container.innerHTML = html;
  
        // Add event listeners to filter buttons if not in limited display mode
        if (!options.limit) {
          const filterButtons = container.querySelectorAll('button[data-category]');
          filterButtons.forEach(button => {
            button.addEventListener('click', () => {
              const category = button.dataset.category;
              if (category === 'all') {
                this.displayArticles(container, { ...options, categoryFilter: null });
              } else {
                this.displayArticles(container, { ...options, categoryFilter: category });
              }
            });
          });
        }
      } catch (error) {
        displayError(container, 'Unable to load articles.');
      }
    },
  
    /**
     * Display a single article with detailed information
     * @param {Element} container - Container element for displaying the article
     * @param {string} articleId - ID of the article to display
     */
    async displayArticle(container, articleId) {
      try {
        const article = await this.getArticle(articleId);
        
        if (!article) {
          throw new Error(`Article ${articleId} not found`);
        }
  
        let html = `
          <article>
            <!-- Article Header -->
            <header class="mb-8">
              <h1 class="text-3xl md:text-4xl font-bold mb-4">${article.title}</h1>
              <div class="flex items-center text-gray-600 mb-6">
                <span class="mr-4"><i class="far fa-calendar-alt mr-2"></i> ${article.date}</span>
                <span class="mr-4"><i class="far fa-user mr-2"></i> By ${article.author}</span>
                <span><i class="far fa-folder mr-2"></i> ${article.categories.join(', ')}</span>
              </div>
              <img src="${CONFIG.imageBasePath}${article.featuredImage}" alt="${article.title}" class="w-full h-auto rounded-lg shadow-lg">
            </header>
  
            <!-- Article Content -->
            <div class="prose max-w-none mb-8">
        `;
  
        // Process article content
        if (article.content && article.content.length) {
          article.content.forEach(block => {
            switch (block.type) {
              case 'paragraph':
                html += `<p>${block.text}</p>`;
                break;
              case 'heading':
                html += `<h${block.level} class="text-${4-block.level+1}xl font-bold mb-${block.level === 2 ? 4 : 3}">${block.text}</h${block.level}>`;
                break;
              case 'list':
                html += '<ul class="list-disc ml-6 mb-6">';
                block.items.forEach(item => {
                  html += `<li class="mb-2">${item}</li>`;
                });
                html += '</ul>';
                break;
              case 'table':
                html += '<div class="overflow-x-auto mb-6"><table class="w-full border-collapse">';
                if (block.headers && block.headers.length) {
                  html += '<thead><tr class="bg-gray-200">';
                  block.headers.forEach(header => {
                    html += `<th class="border border-gray-300 px-4 py-2 text-left">${header}</th>`;
                  });
                  html += '</tr></thead>';
                }
                html += '<tbody>';
                if (block.rows && block.rows.length) {
                  block.rows.forEach((row, index) => {
                    html += `<tr ${index % 2 === 1 ? 'class="bg-gray-50"' : ''}>`;
                    row.forEach(cell => {
                      html += `<td class="border border-gray-300 px-4 py-2">${cell}</td>`;
                    });
                    html += '</tr>';
                  });
                }
                html += '</tbody></table></div>';
                break;
              case 'image':
                html += `
                  <div class="mb-6">
                    <img src="${CONFIG.imageBasePath}${block.src}" alt="${block.alt}" class="w-full h-auto rounded-lg shadow-lg mb-4">
                    ${block.caption ? `<p class="text-sm text-gray-600 italic">${block.caption}</p>` : ''}
                  </div>
                `;
                break;
              case 'callout':
                let calloutColor = 'blue';
                switch (block.style) {
                  case 'warning': calloutColor = 'yellow'; break;
                  case 'tip': calloutColor = 'green'; break;
                  case 'note': calloutColor = 'blue'; break;
                  case 'insight': calloutColor = 'purple'; break;
                }
                html += `
                  <div class="bg-${calloutColor}-50 border-l-4 border-${calloutColor}-500 p-4 mb-6">
                    <h4 class="font-bold">${block.text.split(':')[0]}:</h4>
                    <p>${block.text.split(':').slice(1).join(':').trim()}</p>
                  </div>
                `;
                break;
              case 'callToAction':
                html += `
                  <div class="bg-gray-100 p-6 rounded-lg mt-8">
                    <p class="mb-4">${block.text}</p>
                    <a href="${block.link}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">Contact Our Team</a>
                  </div>
                `;
                break;
            }
          });
        }
  
        html += `
            </div>
  
            <!-- Article Tags -->
            <div class="border-t border-gray-200 pt-6">
              <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700 mr-2">Tags:</span>
        `;
  
        if (article.tags && article.tags.length) {
          article.tags.forEach(tag => {
            html += `<a href="/blog.html?tag=${encodeURIComponent(tag)}" class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300">${tag}</a>`;
          });
        }
  
        html += `
              </div>
            </div>
  
            <!-- Author Info -->
            <div class="flex items-center border-t border-b border-gray-200 py-6 mt-8">
              <img src="${CONFIG.imageBasePath}public/images/team/avatar-placeholder.jpg" alt="${article.author}" class="w-16 h-16 rounded-full mr-4">
              <div>
                <h3 class="font-bold text-lg">${article.author}</h3>
                <p class="text-gray-600">Technical expert at Shanghai Xiongji Material Co., Ltd. with extensive knowledge in steel products and applications.</p>
              </div>
            </div>
  
            <!-- Share Buttons -->
            <div class="mt-8">
              <h3 class="font-bold mb-4">Share This Article</h3>
              <div class="flex space-x-4">
                <a href="#" class="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full hover:bg-blue-700">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-blue-400 text-white flex items-center justify-center rounded-full hover:bg-blue-500">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-blue-800 text-white flex items-center justify-center rounded-full hover:bg-blue-900">
                  <i class="fab fa-linkedin-in"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-green-600 text-white flex items-center justify-center rounded-full hover:bg-green-700">
                  <i class="fab fa-whatsapp"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-gray-200 text-gray-700 flex items-center justify-center rounded-full hover:bg-gray-300">
                  <i class="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </article>
        `;
  
        // Related Articles
        if (article.relatedArticles && article.relatedArticles.length) {
          html += `
            <div class="mt-12">
              <h2 class="text-2xl font-bold mb-6">Related Articles</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          `;
  
          // Load related articles
          const articles = await this.loadArticles();
          const relatedArticles = articles.filter(a => article.relatedArticles.includes(a.id));
  
          relatedArticles.forEach(related => {
            html += `
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="${CONFIG.imageBasePath}${related.featuredImage}" alt="${related.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                  <h3 class="text-xl font-bold mb-2">${related.title}</h3>
                  <p class="text-gray-700 mb-4">${related.summary}</p>
                  <a href="blog/${related.slug}.html" class="text-blue-600 hover:underline">Read More →</a>
                </div>
              </div>
            `;
          });
  
          html += `
              </div>
            </div>
          `;
        }
  
        html += `
          <div class="mt-8">
            <a href="/blog.html" class="text-blue-600 hover:underline">← Back to Blog</a>
          </div>
        `;
  
        container.innerHTML = html;
      } catch (error) {
        displayError(container, `Unable to load article: ${articleId}`);
      }
    }
  };
  
  // Export modules for use in pages
  window.XiongjiData = {
    Products: ProductsModule,
    Projects: ProjectsModule,
    Articles: ArticlesModule
  };