export function rand(a: number, b: number) {
    return Math.floor(Math.random() * (b - a)) + a;
}