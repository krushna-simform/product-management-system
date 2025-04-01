import { ApiServices } from '../controller/apiServices';
import type { Product } from '../model/interfaces';
import { StorageService } from '../utils/localStorageService';
import { templates } from './template';

export class ProductDetails {
    private apiServices: ApiServices;
    private urlParams: URLSearchParams;
    private productId: string;
    private productDetailContainer: HTMLElement;

    constructor() {
        this.apiServices = new ApiServices();
        this.urlParams = new URLSearchParams(window.location.search);
        this.productId = this.urlParams.get('id') || '';

        this.productDetailContainer = document.getElementById(
            'product-details'
        ) as HTMLElement;

        if (!this.isValidProductId(this.productId)) {
            this.productDetailContainer.innerHTML = templates.badRequest(
                this.productId
            );
            return;
        }
        this.loading();
        this.searchProductByID();
    }

    loading() {
        if (!this.productDetailContainer) return;

        this.productDetailContainer.innerHTML = `<p id="loader"></p>`;
    }

    private isValidProductId(productId: string): boolean {
        const parsedId = Number(productId);
        return !isNaN(parsedId) && parsedId > 0;
    }

    async searchProductByID() {
        try {
            const localProducts: Array<Product> = StorageService.getProducts();

            if (!localProducts) return;

            let product = localProducts.find(
                (p) => p.id.toString() === this.productId
            );

            if (!product) {
                product = await this.apiServices.fetchProductById(
                    Number(this.productId)
                );
            }

            if (!this.productDetailContainer) return;

            this.productDetailContainer.innerHTML =
                templates.productDetails(product);
        } catch (err) {
            alert(`Error while fetching product details: ${err}`);
            console.error(`Error while fetching product details: ${err}`);

            this.productDetailContainer.innerHTML = templates.badRequest(
                this.productId
            );
        }
    }
}
