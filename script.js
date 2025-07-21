document.addEventListener('DOMContentLoaded', async function () {
    // بارگذاری داده‌ها از فایل JSON و localStorage
    let products = await loadProducts();
    let categories = await loadCategories();

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

    // تابع بارگذاری محصولات
    async function loadProducts() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            const localProducts = JSON.parse(localStorage.getItem('cafe-products')) || [];
            return [...data.products, ...localProducts];
        } catch (error) {
            console.error('Error loading products:', error);
            return JSON.parse(localStorage.getItem('cafe-products')) || [];
        }
    }

    // تابع بارگذاری دسته‌بندی‌ها
    async function loadCategories() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            const localCategories = JSON.parse(localStorage.getItem('cafe-categories')) || [];
            return [...data.categories, ...localCategories];
        } catch (error) {
            console.error('Error loading categories:', error);
            return JSON.parse(localStorage.getItem('cafe-categories')) || [
                { id: 'coffee', name: 'قهوه', icon: 'fa-coffee' },
                { id: 'hot', name: 'نوشیدنی گرم', icon: 'fa-fire' },
                { id: 'cold', name: 'نوشیدنی سرد', icon: 'fa-snowflake' },
                { id: 'shake', name: 'شیک', icon: 'fa-glass-whiskey' }
            ];
        }
    }

    // بقیه کدهای مربوط به مدیریت و دیالوگ رمز عبور
    const ADMIN_PASSWORD = "sohail123";

    const adminBtn = document.getElementById('admin-btn');
    const passwordDialog = document.getElementById('password-dialog');
    const submitPassword = document.getElementById('submit-password');
    const adminPasswordInput = document.getElementById('admin-password');
    const passwordError = document.getElementById('password-error');

    adminBtn.addEventListener('click', function () {
        passwordDialog.style.display = 'flex';
        adminPasswordInput.focus();
    });

    submitPassword.addEventListener('click', function () {
        const enteredPassword = adminPasswordInput.value.trim();

        if (enteredPassword === ADMIN_PASSWORD) {
            window.open('admin.html', '_blank');
            passwordDialog.style.display = 'none';
            adminPasswordInput.value = '';
            passwordError.textContent = '';
        } else {
            passwordError.textContent = 'رمز عبور اشتباه است!';
        }
    });

    passwordDialog.addEventListener('click', function (e) {
        if (e.target === passwordDialog) {
            passwordDialog.style.display = 'none';
            adminPasswordInput.value = '';
            passwordError.textContent = '';
        }
    });

    adminPasswordInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            submitPassword.click();
        }
    });

    // مقداردهی اولیه
    displayCategories();
    displayProducts();
});
