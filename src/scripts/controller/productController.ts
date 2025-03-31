import { Product } from '../model/interfaces';
import { debounce } from '../utils/debounce';
import { ProductView } from '../view/productView';
import { ApiServices } from './apiServices';

export class ProductController {
    private apiServices: ApiServices;
    private allProducts: Product[] = [];
    private isLoading: boolean = true;
    private view: ProductView;

    private searchBar: HTMLInputElement;

    constructor() {
        this.apiServices = new ApiServices();
        this.view = new ProductView();

        this.searchBar = document.getElementById(
            'search-bar'
        ) as HTMLInputElement;

        this.initialize();
    }

    private async initialize(): Promise<void> {
        this.view.loading();
        await this.fetchData();
    }

    async fetchData(): Promise<void> {
        try {
            const apiProducts = await this.apiServices.fetchProducts();

            this.allProducts = [...apiProducts];
            this.view.renderProducts(this.allProducts);
            this.attachEventHandlers();
        } catch (err) {
            alert(`Get Error while loading product data ${err}`);
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
            alert(`Ger Erroe while searching product data ${err}`);
        }
    }

    attachSearchHandler(): void {
        const debounceSearch = debounce((query: string) => {
            this.searchData(query);
        }, 500);

        if (!this.searchBar) return;

        this.searchBar.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value;
            debounceSearch(query);
        });
    }

    private attachEventHandlers(): void {
        try {
            this.view.handleViewDetailsButton(this.allProducts);
            this.attachSearchHandler();
        } catch (err) {
            alert(`Error while getting product details ${err}`);
        }
    }
}
