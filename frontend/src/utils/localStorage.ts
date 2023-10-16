export function saveToLocalStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage<T>(key: string): T | null {
    const s = localStorage.getItem(key);
    if (s) {
        return JSON.parse(s) as T;
    }
    return null;
}

export function removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
}