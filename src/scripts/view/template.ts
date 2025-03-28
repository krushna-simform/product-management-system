import { Product } from '../model/interfaces';

export const templates = {
    productCard: (product: Product) => {
        return `
        <div class="product-card" tabindex="0" data-id=${product.id}>
            <div class="product-image">
                <img
                    src="${product.thumbnail}"
                    loading="lazy"
                    alt="${product.title}"
                />
            </div>
            <div class="product-info">
                <p>${product.title}</p>
                <div class="price-row">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <span class="discount-badge">${product.discountPercentage}% off</span>
                </div>
                <p class="category">${product.category}</p>
                <div class="rating">
                    ${'★'.repeat(Math.floor(product.rating))}
                    <span>(${product.rating})</span>
                </div>
                <p class="stock">${product.stock} in stock</p>
            </div>
            <div class="card-buttons">
                <button class="delete-details-btn" aria-label="Delete product" id="${product.id}">
                    Delete
                </button>
                <button class="edit-details-btn" aria-label="Edit product id="${product.id}">Edit</button>
                <button class="view-details-btn" aria-label="View Details id="${product.id}">
                    view details
                </button>
            </div>
        </div>
        `;
    },
};
