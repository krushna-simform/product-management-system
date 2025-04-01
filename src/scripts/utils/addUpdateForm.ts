import { Product } from '../model/interfaces';

export const addUpdateForm = {
    addUpdateProductService(
        id: number,
        title: string,
        description: string,
        category: string,
        price: number,
        stock: number,
        thumbnail: string
    ): Product {
        return {
            id: id,
            title: title,
            description: description,
            category: category,
            price: price,
            stock: stock,
            thumbnail: thumbnail,
            discountPercentage: 7.17,
            rating: 4.94,
            tags: ['beauty', 'mascara'],
            brand: 'Essence',
            sku: 'RCH45Q1A',
            weight: 2,
            dimensions: {
                width: 23.17,
                height: 14.43,
                depth: 28.01,
            },
            warrantyInformation: '1 month warranty',
            shippingInformation: 'Ships in 1 month',
            availabilityStatus: 'Low Stock',
            reviews: [
                {
                    rating: 2,
                    comment: 'Very unhappy with my purchase!',
                    date: '2024-05-23T08:56:21.618Z',
                    reviewerName: 'John Doe',
                    reviewerEmail: 'john.doe@x.dummyjson.com',
                },
                {
                    rating: 2,
                    comment: 'Not as described!',
                    date: '2024-05-23T08:56:21.618Z',
                    reviewerName: 'Nolan Gonzalez',
                    reviewerEmail: 'nolan.gonzalez@x.dummyjson.com',
                },
                {
                    rating: 5,
                    comment: 'Very satisfied!',
                    date: '2024-05-23T08:56:21.618Z',
                    reviewerName: 'Scarlett Wright',
                    reviewerEmail: 'scarlett.wright@x.dummyjson.com',
                },
            ],
            returnPolicy: '30 days return policy',
            minimumOrderQuantity: 24,
            meta: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                barcode: '9164035109868',
                qrCode: 'https://assets.dummyjson.com/public/qr-code.png',
            },
            images: [
                'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png',
            ],
        };
    },
};
