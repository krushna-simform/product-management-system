import type { Product } from '../model/interfaces';
import { addUpdateForm } from '../utils/addUpdateForm';
import { debounce } from '../utils/debounce';
import { FormValidation } from '../utils/formValidation';
import { StorageService } from '../utils/localStorageService';
import { ProductView } from '../view/productView';
import { ApiServices } from './apiServices';

export class ProductController {
    private apiServices: ApiServices;
    private allProducts: Array<Product> = [];
    private isLoading: boolean = true;
    private view: ProductView;
    private formValidation: FormValidation;

    private searchBar: HTMLInputElement;
    private addProductButton: HTMLButtonElement;
    private addFormContainer: HTMLElement;
    private closeFormButton: HTMLButtonElement;
    private addProductForm: HTMLFormElement;
    private productContainer: HTMLElement;
    private editProductId: number | null = null;

    constructor() {
        this.apiServices = new ApiServices();
        this.view = new ProductView();
        this.formValidation = new FormValidation();

        this.searchBar = document.getElementById(
            'search-bar'
        ) as HTMLInputElement;

        this.addProductButton = document.getElementById(
            'add-button'
        ) as HTMLButtonElement;

        this.addFormContainer = document.getElementById(
            'product-form-container'
        ) as HTMLElement;

        this.closeFormButton = document.getElementById(
            'close-form-btn'
        ) as HTMLButtonElement;

        this.addProductForm = document.getElementById(
            'product-form'
        ) as HTMLFormElement;

        this.productContainer = document.getElementById(
            'product-container'
        ) as HTMLElement;

        this.initialize();
    }

    private async initialize(): Promise<void> {
        this.view.loading();
        await this.fetchData();
        this.attachEventHandlers();
    }

    async fetchData(): Promise<void> {
        try {
            const localProducts: Array<Product> = StorageService.getProducts();
            const apiProducts = await this.apiServices.fetchProducts();

            this.allProducts = [...localProducts, ...apiProducts];
            this.view.renderProducts(this.allProducts);
        } catch (err) {
            alert(`Get Error while loading product data ${err}`);
            console.error(`Get Error while loading product data ${err}`);
        } finally {
            this.isLoading = false;
        }
    }

    async searchData(query: string): Promise<void> {
        const localFiltered = StorageService.getProducts().filter(
            (product) =>
                product.title.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase()) ||
                product.brand.toLowerCase().includes(query.toLowerCase())
        );

        try {
            const apiProducts = await this.apiServices.searchProducts(query);
            this.allProducts = [...localFiltered, ...apiProducts];
            this.view.renderProducts(this.allProducts);
            this.view.handleViewDetailsButton(this.allProducts);
        } catch (err) {
            alert(`Get Error while searching product data ${err}`);
            console.error(`Get Error while searching product data ${err}`);
        }
    }

    attachSearchHandler(): void {
        let lastQuery = '';

        const debounceSearch = debounce((query: string) => {
            const trimmedQuery = query.trim();

            if (trimmedQuery === '') {
                if (lastQuery !== '') {
                    this.fetchData();
                }
            } else if (trimmedQuery !== lastQuery) {
                this.searchData(trimmedQuery);
            }
            lastQuery = trimmedQuery;
        }, 500);

        if (!this.searchBar) return;

        this.searchBar.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value;
            debounceSearch(query);
        });
    }

    attachFormHandler(): void {
        if (
            !this.addProductButton ||
            !this.addProductForm ||
            !this.addFormContainer
        ) {
            console.error('elements are missing');
            return;
        }

        (
            this.addFormContainer.querySelector('#title') as HTMLInputElement
        ).addEventListener('input', (e) => {
            const title = (e.target as HTMLInputElement).value;
            const errorMessage = this.formValidation.validateTitle(title);
            if (errorMessage) {
                this.formValidation.showError('title', errorMessage);
            } else {
                this.formValidation.clearError('title');
            }
        });

        (
            this.addProductForm.querySelector(
                '#description'
            ) as HTMLInputElement
        ).addEventListener('input', (e) => {
            const description = (e.target as HTMLInputElement).value;
            const errorMessage =
                this.formValidation.validateDescription(description);
            if (errorMessage) {
                this.formValidation.showError('description', errorMessage);
            } else {
                this.formValidation.clearError('description');
            }
        });

        (
            this.addProductForm.querySelector('#category') as HTMLInputElement
        ).addEventListener('input', (e) => {
            const category = (e.target as HTMLInputElement).value;
            const errorMessage = this.formValidation.validateCategory(category);
            if (errorMessage) {
                this.formValidation.showError('category', errorMessage);
            } else {
                this.formValidation.clearError('category');
            }
        });

        (
            this.addProductForm.querySelector('#price') as HTMLImageElement
        ).addEventListener('input', (e) => {
            const price = Number((e.target as HTMLInputElement).value);
            const errorMessage = this.formValidation.validatePrice(price);
            if (errorMessage) {
                this.formValidation.showError('price', errorMessage);
            } else {
                this.formValidation.clearError('price');
            }
        });

        (
            this.addProductForm.querySelector('#stock') as HTMLInputElement
        ).addEventListener('input', (e) => {
            const stock = Number((e.target as HTMLInputElement).value);
            const errorMessage = this.formValidation.validateStock(stock);
            if (errorMessage) {
                this.formValidation.showError('stock', errorMessage);
            } else {
                this.formValidation.clearError('stock');
            }
        });

        (
            this.addProductForm.querySelector('#imageUrl') as HTMLInputElement
        ).addEventListener('input', (e) => {
            const imageUrl = (e.target as HTMLInputElement).value;
            const errorMessage = this.formValidation.validateImageUrl(imageUrl);
            if (errorMessage) {
                this.formValidation.showError('imageUrl', errorMessage);
            } else {
                this.formValidation.clearError('imageUrl');
            }
        });

        this.addProductButton.addEventListener('click', () => {
            this.editProductId = null;
            this.addProductForm.reset();
            this.addFormContainer.classList.remove('hidden');
            this.productContainer.classList.add('blur');
        });

        this.closeFormButton.addEventListener('click', () => {
            this.addFormContainer.classList.add('hidden');
            this.productContainer.classList.remove('blur');
        });

        this.addProductForm.removeEventListener('submit', this.onFormSubmit);
        this.addProductForm.addEventListener('submit', this.onFormSubmit);
    }

    private onFormSubmit = async (e: Event) => {
        e.preventDefault();
        if (this.editProductId !== null) {
            await this.updateExistingProduct();
        } else {
            await this.addNewProduct();
        }
    };

    loadProductDetailsIntoForm(product: Product) {
        if (!product) return;

        const setValue = (selector: string, value: string | number) => {
            (
                this.addProductForm.querySelector(selector) as HTMLInputElement
            ).value = String(value);
        };

        const submitBtn = this.addProductForm.querySelector(
            '#submit-btn'
        ) as HTMLButtonElement;

        if (!submitBtn) {
            return;
        } else if (submitBtn) {
            submitBtn.textContent = 'Update';
        }

        setValue('#title', product.title);
        setValue('#description', product.description);
        setValue('#category', product.category);
        setValue('#price', product.price);
        setValue('#stock', product.stock);
        setValue('#imageUrl', product.thumbnail);
    }

    attachEditButtonHandler(products: Array<Product>) {
        if (!products) return;

        const editButtons = document.querySelectorAll('.edit-details-btn');
        if (!editButtons) return;

        editButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.editProductId = products[index].id;
                this.loadProductDetailsIntoForm(products[index]);
                this.addFormContainer.classList.remove('hidden');
                this.productContainer.classList.add('blur');
            });
        });
    }

    attachDeleteButtonHandler(): void {
        const deleteButtons = document.querySelectorAll('.delete-details-btn');

        if (!deleteButtons) return;

        deleteButtons.forEach((btn) => {
            btn.addEventListener('click', async (e: Event) => {
                const productId = parseInt((e.target as HTMLButtonElement).id);
                if (confirm('Are you sure you want to delete this product?')) {
                    StorageService.deleteProduct(productId);
                    this.initialize();
                }
            });
        });
    }

    async addProduct(isUpdate: boolean = false) {
        const getValue = (selector: string) =>
            (
                this.addProductForm.querySelector(selector) as HTMLInputElement
            )?.value.trim() || '';

        const title = getValue('#title');
        const description = getValue('#description');
        const category = getValue('#category');
        const price = Number(getValue('#price'));
        const stock = Number(getValue('#stock'));
        const imageUrl = getValue('#imageUrl');

        const titleError = this.formValidation.validateTitle(title);
        const descriptionError =
            this.formValidation.validateDescription(description);
        const categoryError = this.formValidation.validateCategory(category);
        const priceError = this.formValidation.validatePrice(price);
        const stockError = this.formValidation.validateStock(stock);
        const imageUrlError = this.formValidation.validateImageUrl(imageUrl);

        if (
            titleError ||
            descriptionError ||
            categoryError ||
            priceError ||
            stockError ||
            imageUrlError
        ) {
            this.formValidation.showError('title', titleError);
            this.formValidation.showError('description', descriptionError);
            this.formValidation.showError('category', categoryError);
            this.formValidation.showError('price', priceError);
            this.formValidation.showError('stock', stockError);
            this.formValidation.showError('imageUrl', imageUrlError);
            return;
        }

        const id = isUpdate
            ? this.editProductId!
            : Math.floor(Math.random() * 100000);
        const productData = addUpdateForm.addUpdateProductService(
            id,
            title,
            description,
            category,
            price,
            stock,
            imageUrl
        );

        if (isUpdate) {
            StorageService.updateProduct(productData);
            alert('Product updated successfully!');
        } else {
            StorageService.addProduct(productData);
            alert('Product added successfully!');
        }

        this.addProductForm.reset();
        this.addFormContainer.classList.add('hidden');
        this.productContainer.classList.remove('blur');
        this.initialize();
    }

    async addNewProduct() {
        await this.addProduct(false);
    }

    async updateExistingProduct() {
        if (this.editProductId === null) return;
        await this.addProduct(true);
    }

    private attachEventHandlers(): void {
        try {
            this.view.handleViewDetailsButton(this.allProducts);
            this.attachSearchHandler();
            this.attachFormHandler();
            this.attachEditButtonHandler(this.allProducts);
            this.attachDeleteButtonHandler();
        } catch (err) {
            alert(`Error while getting product details ${err}`);
            console.error(`Error while getting product details ${err}`);
        }
    }
}
