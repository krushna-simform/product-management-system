import { Product } from '../model/interfaces';
import { ProductView } from '../view/productView';
import { ApiServices } from './apiServices';

export class ProductControler {
    private apiServices: ApiServices;
    private allProducts: Product[] = [];
    private isLoading: boolean = true;
    private view!: ProductView;

    constructor() {
        this.apiServices = new ApiServices();
        this.view = new ProductView();
        this.initalize();
    }

    private async initalize(): Promise<void> {
        this.view.loading();
        await this.fetchData();
    }

    async fetchData(): Promise<void> {
        try {
            const apiProducts = await this.apiServices.fetchProducts();

            this.allProducts = [...apiProducts];
            this.view.renderProducts(this.allProducts);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            this.isLoading = false;
        }
    }
}
