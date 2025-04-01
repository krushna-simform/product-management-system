import type { Product, ProductResponse } from '../model/interfaces';

export class ApiServices {
    private readonly URL: string = 'https://dummyjson.com/products';

    async fetchProducts(): Promise<Array<Product>> {
        const response = await fetch(`${this.URL}`);
        const data: ProductResponse = await response.json();
        return data.products;
    }

    async fetchProductById(query: number): Promise<Product> {
        const response = await fetch(`${this.URL}/${query}`);
        const data: Product = await response.json();
        return data;
    }

    async searchProducts(query: string): Promise<Array<Product>> {
        const response = await fetch(`${this.URL}/search?q=${query}`);
        const data: ProductResponse = await response.json();
        return data.products;
    }
}
