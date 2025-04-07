export class FormValidation {
    validateTitle(title: string): string {
        if (!title) return 'Please provide a title.';
        if (!/^[A-Za-z\s]+[A-Za-z0-9\s]*$/.test(title)) {
            return 'Title contains invalid characters. Only letters, numbers, and spaces allowed, starting with a letter.';
        }
        if (title.length > 30) return 'Title must not exceed 30 characters.';
        return '';
    }

    validateDescription(description: string): string {
        if (!description) return 'Please provide a description.';
        if (description.length > 200)
            return 'Description must not exceed 200 characters.';
        return '';
    }

    validateCategory(category: string): string {
        if (!category) return 'Please provide a category.';
        if (!/^[A-Za-z\s]+[A-Za-z0-9\s]*$/.test(category)) {
            return 'Category contains invalid characters. Only letters, numbers, and spaces allowed, starting with a letter.';
        }
        if (category.length > 30)
            return 'Category must not exceed 30 characters.';
        return '';
    }

    validatePrice(price: number): string {
        if (isNaN(price) || price <= 0)
            return 'Please provide a valid price greater than 0.';
        if (price > 10000) return 'Price must not exceed 10,000.';
        return '';
    }

    validateStock(stock: number): string {
        if (isNaN(stock) || stock <= 0)
            return 'Please provide a valid stock quantity greater than 0.';
        if (stock > 1000) return 'Stock must not exceed 1,000.';
        return '';
    }

    validateImageUrl(imageUrl: string): string {
        if (!imageUrl) return 'Please provide an image URL.';
        return '';
    }

    showError(inputId: string, message: string): void {
        const errorElement = document.getElementById(
            `${inputId}Error`
        ) as HTMLElement;
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(inputId: string): void {
        const errorElement = document.getElementById(
            `${inputId}Error`
        ) as HTMLElement;
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
}
