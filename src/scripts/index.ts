import { ProductController } from './controller/productController';
import { ProductDetails } from './view/productDetails';

document.addEventListener('DOMContentLoaded', () => {
    const isProductDetailPage =
        window.location.pathname.includes('product.html');

    if (isProductDetailPage) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) {
            new ProductDetails();
        } else {
            window.location.href = '/';
        }
    } else {
        new ProductController();
    }
});
