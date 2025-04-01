import type { Product } from '../model/interfaces';
import { templates } from './template';

export class ProductView {
    private productContainer: HTMLElement;

    constructor() {
        this.productContainer = document.getElementById(
            'product-container'
        ) as HTMLElement;
    }

    renderProducts(products: Array<Product>): void {
        if (!products || products.length == 0) {
            this.showEmpty();
            return;
        }

        if (!this.productContainer) return;

        this.productContainer.innerHTML = products
            .map(templates.productCard)
            .join('');
    }

    private showEmpty(): void {
        if (!this.productContainer) return;

        this.productContainer.innerHTML = `<p id="no-product-found">No products found</p>`;
    }

    loading() {
        if (!this.productContainer) return;

        this.productContainer.innerHTML = `<p>Loading...</p>`;
    }

    handleViewDetailsButton(product: Array<Product>) {
        document
            .querySelectorAll('.view-details-btn')
            .forEach((btn, index: number) => {
                btn.addEventListener('click', () => {
                    const productId: number = product[index].id;
                    window.location.href = `product.html?id=${productId}`;
                });
            });

        document
            .querySelectorAll('.product-image')
            .forEach((btn, index: number) => {
                btn.addEventListener('click', () => {
                    const productId: number = product[index].id;
                    window.location.href = `product.html?id=${productId}`;
                });
            });
    }
}
