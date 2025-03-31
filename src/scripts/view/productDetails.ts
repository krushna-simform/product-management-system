import { ApiServices } from '../controller/apiServices';
import { templates } from './template';

export class ProductDetails {
    private apiServices: ApiServices;
    private urlParams: URLSearchParams;
    private productId: string;
    private productDetailContainer: HTMLElement;

    constructor() {
        this.apiServices = new ApiServices();
        this.urlParams = new URLSearchParams(window.location.search);
        this.productId = this.urlParams.get('id')!;
        this.productDetailContainer = document.getElementById(
            'product-details'
        ) as HTMLElement;
        this.searchProductByID();
    }

    async searchProductByID() {
        try {
            const product = await this.apiServices.fetchProductById(
                this.productId
            );

            this.productDetailContainer.innerHTML =
                templates.productDetails(product);
        } catch (err) {
            console.log('Error fetching product details:', err);
        }
    }
}
