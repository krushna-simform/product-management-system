import type { Product, Review } from '../model/interfaces';

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
                <button class="edit-details-btn" aria-label="Edit product" id="${product.id}">Edit</button>
                <button class="view-details-btn" aria-label="View Details" id="${product.id}">
                    View Details
                </button>
            </div>
        </div>
        `;
    },

    productDetails: (product: Product) => `
        <div>
            <div class="detail-header">
                <div class="product-detail-image" >
                    <img src="${product.thumbnail}" alt="${product.title}">
                </div>
                <div class="product-dis">
                    <p class="product-title">${product.title}</p>
                    <p class="product-brand">by ${product.brand}</p>
                    <div class="product-price-des">
                        <span class="product-detail-price">$${product.price.toFixed(2)}</span>
                        <span class="product-detail-discount-badge">${product.discountPercentage}% off</span>
                    </div>
                    <div class="rating">
                        ${'★'.repeat(Math.floor(product.rating))}
                        <span>(${product.rating})</span>
                        <spam>(${product.reviews.length} reviews)</spam>
                    </div>
                    <p class="stock">${product.stock} available</p>
                    <p class="product-des-badge">Description</p>
                    <p class="description">${product.description}</p>
                </div>
            </div>
            <div class="more-product-details">
                <p>Specifications</p>
                <ul>
                    <li><strong>SKU: </strong>SKU ${product.sku}</li>
                    <li><strong>Weight: </strong> ${product.weight} kg</li>
                    <li><strong>Dimension: </strong>Dimension ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm</li>
                    </ul>
                    <p>Policies</p>
                <ul>
                    <li><strong>Shipping: </strong>Shipping ${product.shippingInformation}</li>
                    <li><strong>Warranty: </strong>Warranty ${product.warrantyInformation}</li>
                    <li><strong>Returns: </strong>Returns ${product.returnPolicy}</li>
                </ul>
            </div>
            ${templates.productReview(product)}
        </div>
        </div>
  `,

    badRequest: (productId: string) => `
        <div class="bad-request-container">
            <p class="bad-request-message-1">Bad Request :(</p>
            <p class="bad-request-message-2">404 product with id ${productId} is not found!</p>
        </div>
  `,

    productReview: (product: Product) => `
        ${
            product.reviews.length > 0
                ? `
            <div class="reviews-section">
                <p>Customer Reviews</p>
                <div class="reviews">
                    ${product.reviews
                        .map(
                            (review: Review) => `
                    <div class="review">
                        <div class="review-header">
                            <div class="reviewer">${review.reviewerName}</div>
                            <div class="review-rating">${'★'.repeat(review.rating)}</div>
                            <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
                        </div>
                        <p class="review-comment">${review.comment}</p>
                    </div>
                    `
                        )
                        .join('')}
                </div>
            </div>
            `
                : ''
        }
    `,
};
