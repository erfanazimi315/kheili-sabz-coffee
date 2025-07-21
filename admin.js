document.addEventListener('DOMContentLoaded', async function () {
    // بارگذاری داده‌ها
    let products = await loadProducts();
    let categories = await loadCategories();

    const addProductForm = document.getElementById('add-product-form');
    const adminProductsContainer = document.getElementById('admin-products-container');
    const backToMenuBtn = document.getElementById('back-to-menu');
    const imagePreview = document.getElementById('image-preview');
    const imageInput = document.getElementById('product-image');
    const categoriesContainer = document.getElementById('categories-container');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const newCategoryName = document.getElementById('new-category-name');

    let currentEditIndex = null;
    let currentEditCategoryIndex = null;

    // توابع بارگذاری داده‌ها
    async function loadProducts() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            return data.products || [];
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    async function loadCategories() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            return data.categories || [
                { id: 'coffee', name: 'قهوه', icon: 'fa-coffee' },
                { id: 'hot', name: 'نوشیدنی گرم', icon: 'fa-fire' },
                { id: 'cold', name: 'نوشیدنی سرد', icon: 'fa-snowflake' },
                { id: 'shake', name: 'شیک', icon: 'fa-glass-whiskey' }
            ];
        } catch (error) {
            console.error('Error loading categories:', error);
            return [
                { id: 'coffee', name: 'قهوه', icon: 'fa-coffee' },
                { id: 'hot', name: 'نوشیدنی گرم', icon: 'fa-fire' },
                { id: 'cold', name: 'نوشیدنی سرد', icon: 'fa-snowflake' },
                { id: 'shake', name: 'شیک', icon: 'fa-glass-whiskey' }
            ];
        }
    }

    // ذخیره داده‌ها در فایل JSON
    async function saveDataToFile() {
        const data = {
            products: products,
            categories: categories
        };

        try {
            const response = await fetch('save_data.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving data:', error);
            // Fallback to localStorage if server save fails
            localStorage.setItem('cafe-products', JSON.stringify(products));
            localStorage.setItem('cafe-categories', JSON.stringify(categories));
            return false;
        }
    }

    // نمایش محصولات در بخش مدیریت
    function displayAdminProducts() {
        adminProductsContainer.innerHTML = '';

        if (products.length === 0) {
            adminProductsContainer.innerHTML = '<p class="no-products">هیچ محصولی وجود ندارد</p>';
            return;
        }

        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'admin-product-card';
            productCard.innerHTML = `
                <div class="admin-product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="admin-product-image">
                </div>
                <p><strong><i class="fas fa-tag"></i> دسته:</strong> ${getCategoryName(product.category)}</p>
                <p><strong><i class="fas fa-pen"></i> نام:</strong> ${product.name}</p>
                <p><strong><i class="fas fa-tags"></i> قیمت:</strong> ${product.price.toLocaleString()} تومان</p>
                <div class="admin-product-actions">
                    <button class="edit-btn" data-index="${index}">
                        <i class="fas fa-edit"></i> ویرایش
                    </button>
                    <button class="delete-btn" data-index="${index}">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            `;
            adminProductsContainer.appendChild(productCard);
        });

        // رویدادهای ویرایش و حذف محصولات
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                editProduct(index);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                deleteProduct(index);
            });
        });
    }

    // نمایش دسته‌بندی‌ها
    function displayCategories() {
        categoriesContainer.innerHTML = '';

        if (categories.length === 0) {
            categoriesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tags"></i>
                    <p>هیچ دسته‌بندی تعریف نشده است</p>
                </div>
            `;
            return;
        }

        categories.forEach((category, index) => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-item';
            categoryElement.innerHTML = `
                <div class="category-info">
                    <i class="fas ${category.icon}"></i>
                    <span>${category.name}</span>
                </div>
                <div class="category-actions">
                    <button class="edit-category-btn" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-category-btn" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            categoriesContainer.appendChild(categoryElement);
        });

        // رویدادهای ویرایش و حذف دسته‌بندی‌ها
        document.querySelectorAll('.edit-category-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                editCategory(index);
            });
        });

        document.querySelectorAll('.delete-category-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                deleteCategory(index);
            });
        });
    }

    // تبدیل نام دسته بندی به فارسی
    function getCategoryName(categoryId) {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }

    // به‌روزرسانی select دسته‌بندی‌ها
    function updateCategorySelect() {
        const select = document.getElementById('product-category');
        select.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    }

    // پیش‌نمایش تصویر محصول
    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.innerHTML = `
                    <img src="${e.target.result}" alt="پیش‌نمایش تصویر" class="preview-image">
                    <button type="button" class="remove-image-btn">
                        <i class="fas fa-times"></i>
                    </button>
                `;

                document.querySelector('.remove-image-btn').addEventListener('click', function () {
                    imagePreview.innerHTML = '';
                    imageInput.value = '';
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // افزودن محصول جدید
    addProductForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const category = document.getElementById('product-category').value;
        const name = document.getElementById('product-name').value;
        const price = parseInt(document.getElementById('product-price').value);
        const file = imageInput.files[0];

        if (!file) {
            showAlert('خطا', 'لطفا تصویری برای محصول انتخاب کنید', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async function (e) {
            const image = e.target.result;

            const newProduct = {
                category,
                name,
                price,
                image
            };

            if (currentEditIndex !== null) {
                // ویرایش محصول موجود
                products[currentEditIndex] = newProduct;
                currentEditIndex = null;
            } else {
                // افزودن محصول جدید
                products.push(newProduct);
            }

            await saveDataToFile();
            addProductForm.reset();
            imagePreview.innerHTML = '';
            displayAdminProducts();

            showAlert('موفقیت', 'محصول با موفقیت ذخیره شد!', 'success');
        };
        reader.readAsDataURL(file);
    });

    // ویرایش محصول
    function editProduct(index) {
        const product = products[index];
        currentEditIndex = index;

        document.getElementById('product-category').value = product.category;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;

        imagePreview.innerHTML = `
            <img src="${product.image}" alt="پیش‌نمایش تصویر" class="preview-image">
            <button type="button" class="remove-image-btn">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.querySelector('.remove-image-btn').addEventListener('click', function () {
            imagePreview.innerHTML = '';
            imageInput.value = '';
        });

        document.querySelector('.add-product').scrollIntoView({ behavior: 'smooth' });
    }

    // حذف محصول
    async function deleteProduct(index) {
        if (confirm('آیا از حذف این محصول مطمئن هستید؟ این عمل قابل بازگشت نیست.')) {
            products.splice(index, 1);
            await saveDataToFile();
            displayAdminProducts();

            if (currentEditIndex === index) {
                currentEditIndex = null;
                addProductForm.reset();
                imagePreview.innerHTML = '';
            }

            showAlert('موفقیت', 'محصول با موفقیت حذف شد', 'success');
        }
    }

    // افزودن دسته جدید
    addCategoryBtn.addEventListener('click', async function () {
        const name = newCategoryName.value.trim();

        if (!name) {
            showAlert('خطا', 'لطفا نام دسته را وارد کنید', 'error');
            return;
        }

        const id = name.replace(/\s+/g, '-').toLowerCase();

        if (categories.some(c => c.id === id)) {
            showAlert('خطا', 'این دسته قبلا ثبت شده است', 'error');
            return;
        }

        const newCategory = {
            id,
            name,
            icon: 'fa-tag'
        };

        categories.push(newCategory);
        await saveDataToFile();
        newCategoryName.value = '';
        updateCategorySelect();
        displayCategories();

        showAlert('موفقیت', 'دسته جدید با موفقیت اضافه شد', 'success');
    });

    // ویرایش دسته
    async function editCategory(index) {
        const newName = prompt('نام جدید دسته:', categories[index].name);
        if (newName && newName.trim()) {
            categories[index].name = newName.trim();
            await saveDataToFile();
            updateCategorySelect();
            displayCategories();

            showAlert('موفقیت', 'دسته با موفقیت ویرایش شد', 'success');
        }
    }

    // حذف دسته
    async function deleteCategory(index) {
        const category = categories[index];
        const categoryId = category.id.toLowerCase();

        const hasProducts = products.some(p => p.category.toLowerCase() === categoryId);

        if (hasProducts) {
            showAlert('خطا', 'این دسته دارای محصول است و نمی‌توان آن را حذف کرد', 'error');
            return;
        }

        if (confirm(`آیا از حذف دائم دسته "${category.name}" مطمئن هستید؟`)) {
            categories.splice(index, 1);
            await saveDataToFile();
            updateCategorySelect();
            displayCategories();

            showAlert('موفقیت', 'دسته با موفقیت حذف شد', 'success');
        }
    }

    // نمایش پیغام
    function showAlert(title, message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-message ${type}`;
        alertDiv.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <div>
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 500);
        }, 3000);
    }

    // بازگشت به منو
    backToMenuBtn.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // مقداردهی اولیه
    displayAdminProducts();
    displayCategories();
    updateCategorySelect();
});