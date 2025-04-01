export function debounce<T extends (...args: Parameters<T>) => void>(
    func: T,
    delay: number
) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    return function (this: unknown, ...args: Parameters<T>) {
        if (timer !== undefined) clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
