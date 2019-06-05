export default function toFormUrlEncoded(data: any): string {
    if (typeof data !== 'object' || data === null) {
        return data;
    }

    return Object.keys(data)
        .filter(key => data[key] !== undefined)
        .map(key => {
            const value = data[key];

            if (typeof value === 'string') {
                return `${key}=${encodeURIComponent(value)}`;
            }

            return `${key}=${encodeURIComponent(JSON.stringify(value) || '')}`;
        })
        .join('&');
}
