import { Product } from '../model/interfaces';
import { templates } from './template';

export class ProductView {
    private productContainer: HTMLElement;

    constructor() {
        this.productContainer = document.getElementById(
            'product-container'
        ) as HTMLElement;
    }

    renderProducts(products: Product[]): void {
        if (!products || products.length == 0) {
            this.showEmpty();
        }
        this.productContainer.innerHTML = products
            .map(templates.productCard)
            .join('');
    }

    private showEmpty(): void {
        this.productContainer.innerHTML = `<p>No products found</p>`;
    }

    loading() {
        this.productContainer.innerHTML = `<p>Loading...</p>`;
    }
}
