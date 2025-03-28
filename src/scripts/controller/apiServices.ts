import { Product, ProductResponse } from '../model/interfaces';

export class ApiServices {
    private URL: string = 'https://dummyjson.com/products';

    async fetchProducts(): Promise<Product[]> {
        const response = await fetch(`${this.URL}`);
        const data: ProductResponse = await response.json();
        return data.products;
    }

    async searchOneProduct(query: string): Promise<Product> {
        const response = await fetch(`${this.URL}/${query}`);
        const data: Product = await response.json();
        return data;
    }

    async searchProducts(query: string): Promise<Product[]> {
        const response = await fetch(`${this.URL}/search?q=${query}`);
        const data: ProductResponse = await response.json();
        return data.products;
    }
}
