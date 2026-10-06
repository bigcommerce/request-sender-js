/**
 * Converts params to a query string without the leading `?`.
 *
 * - The keys are sorted by their string value.
 * - A `null` value gives only the key. An `undefined` value is skipped.
 * - An array value repeats the key for each item (`a=1&a=2`).
 * - When `encode` is truthy, keys and values use `encodeURIComponent`, and the
 *   characters `!'()*` are also percent-encoded.
 *
 * `URLSearchParams` is not used because it encodes a space as `+` and does
 * not encode `!'()*`.
 */
export default function stringifyQuery(params: { [key: string]: any }, encode: boolean = true): string {
    const format = (value: any) => encode ? strictEncode(value) : value;
    const pair = (key: string, value: any) => value === null ? format(key) : `${format(key)}=${format(value)}`;

    return Object.keys(params)
        .sort()
        .map(key => {
            const value = params[key];

            if (value === undefined) {
                return '';
            }

            if (Array.isArray(value)) {
                return value
                    .filter(item => item !== undefined)
                    .map(item => pair(key, item))
                    .join('&');
            }

            return pair(key, value);
        })
        .filter(part => part.length > 0)
        .join('&');
}

function strictEncode(value: any): string {
    return encodeURIComponent(value)
        .replace(/[!'()*]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}
