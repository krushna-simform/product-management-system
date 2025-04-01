import type { Product } from '../model/interfaces';
import { addUpdateForm } from '../utils/addUpdateForm';
import { debounce } from '../utils/debounce';
import { StorageService } from '../utils/localStorageService';
import { ProductView } from '../view/productView';
import { ApiServices } from './apiServices';

export class ProductController {
    private apiServices: ApiServices;
    private allProducts: Array<Product> = [];
    private isLoading: boolean = true;
    private view: ProductView;

    private searchBar: HTMLInputElement;
    private addProductButton: HTMLButtonElement;
    private addFormContainer: HTMLElement;
    private closeFormButton: HTMLButtonElement;
    private addProductForm: HTMLFormElement;
    private editProductId: number | null = null;

    constructor() {
        this.apiServices = new ApiServices();
        this.view = new ProductView();

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
        try {
            const apiProducts = await this.apiServices.searchProducts(query);
            this.allProducts = [...apiProducts];
            this.view.renderProducts(this.allProducts);
        } catch (err) {
            alert(`Get Error while searching product data ${err}`);
            console.error(`Get Error while searching product data ${err}`);
        }
    }

    attachSearchHandler(): void {
        const debounceSearch = debounce((query: string) => {
            this.searchData(query);
        }, 500);

        if (!this.searchBar) return;

        this.searchBar.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value;
            if (query.trim() == '') return;
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

        this.addProductButton.addEventListener('click', () => {
            this.editProductId = null;
            this.addProductForm.reset();
            this.addFormContainer.classList.remove('hidden');
        });

        this.closeFormButton.addEventListener('click', () => {
            this.addFormContainer.classList.add('hidden');
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

    attachEditButtonHandler(products: Product[]) {
        if (!products) return;

        const editButtons = document.querySelectorAll('.edit-details-btn');
        if (!editButtons) return;

        editButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.editProductId = products[index].id;
                this.loadProductDetailsIntoForm(products[index]);
                this.addFormContainer.classList.remove('hidden');
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

        if (
            !title ||
            !description ||
            !category ||
            isNaN(price) ||
            price <= 0 ||
            isNaN(stock) ||
            stock <= 0 ||
            !imageUrl
        ) {
            alert('Please fill out all required fields with valid data.');
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
        } catch (err) {
            alert(`Error while getting product details ${err}`);
            console.error(`Error while getting product details ${err}`);
        }
    }
}
