document.addEventListener('DOMContentLoaded', function () {
    // بارگذاری محصولات و دسته‌بندی‌ها از localStorage
    const products = JSON.parse(localStorage.getItem('cafe-products')) || [];
    const categories = JSON.parse(localStorage.getItem('cafe-categories')) || [
        { id: 'coffee', name: 'قهوه', icon: 'fa-coffee' },
        { id: 'hot', name: 'نوشیدنی گرم', icon: 'fa-fire' },
        { id: 'cold', name: 'نوشیدنی سرد', icon: 'fa-snowflake' },
        { id: 'shake', name: 'شیک', icon: 'fa-glass-whiskey' }
    ];

    const productsContainer = document.getElementById('products-container');
    const categoriesContainer = document.querySelector('.categories');

    // نمایش دسته‌بندی‌ها
    function displayCategories() {
        categoriesContainer.innerHTML = '';

        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-btn';
            if (category.id === 'coffee') button.classList.add('active');
            button.setAttribute('data-category', category.id);
            button.innerHTML = `
                <i class="fas ${category.icon}"></i> ${category.name}
            `;

            button.addEventListener('click', function () {
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                displayProducts(category.id);
            });

            categoriesContainer.appendChild(button);
        });
    }

    // نمایش محصولات
    function displayProducts(categoryId = 'coffee') {
        productsContainer.innerHTML = '';

        const filteredProducts = products.filter(product => product.category === categoryId);

        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = '<p class="no-products">محصولی در این دسته بندی وجود ندارد</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price.toLocaleString()} تومان</p>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // مقداردهی اولیه
    displayCategories();
    displayProducts();
});