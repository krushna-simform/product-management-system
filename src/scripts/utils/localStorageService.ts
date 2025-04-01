import { Product } from '../model/interfaces';

export class StorageService {
    private static readonly PRODUCTS_KEY = 'customProducts';

    static getProducts(): Product[] {
        const products = localStorage.getItem(this.PRODUCTS_KEY);
        return products ? JSON.parse(products) : [];
    }

    static saveProducts(products: Product[]): void {
        if (!products) return;
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    }

    static addProduct(product: Product): void {
        const products = this.getProducts();
        if (!product) return;
        products.unshift(product);
        this.saveProducts(products);
    }

    static updateProduct(updatedProduct: Product): void {
        let products = this.getProducts();
        if (!products) return;
        products = products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
        );
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    }

    static deleteProduct(productId: number): void {
        let products = this.getProducts();
        if (!productId) return;
        products = products.filter((product) => product.id !== productId);
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    }
}
