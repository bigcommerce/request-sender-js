export default interface CookieReader {
    get(name: string): string | undefined;
}
