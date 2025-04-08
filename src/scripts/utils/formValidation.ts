export class FormValidation {
    private readonly regexForValidation: RegExp = /^[A-Za-z\s]+[A-Za-z0-9\s]*$/;

    private validateWithRegex(
        value: string,
        regex: RegExp,
        maxLength: number,
        fieldName: string
    ): string {
        if (!value) return `Please provide a ${fieldName}.`;
        if (!regex.test(value)) {
            return `${fieldName} contains invalid characters. Only letters, numbers, and spaces allowed, starting with a letter.`;
        }
        if (value.length > maxLength)
            return `${fieldName} must not exceed ${maxLength} characters.`;
        return '';
    }

    validateTitle(title: string): string {
        return this.validateWithRegex(
            title,
            this.regexForValidation,
            30,
            'title'
        );
    }

    validateDescription(description: string): string {
        return this.validateWithRegex(
            description,
            this.regexForValidation,
            200,
            'description'
        );
    }

    validateCategory(category: string): string {
        return this.validateWithRegex(
            category,
            this.regexForValidation,
            30,
            'category'
        );
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
