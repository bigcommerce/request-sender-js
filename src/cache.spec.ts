import { DefaultCache } from './cache';
import { getResponse } from './responses.mock';

describe('DefaultCache', () => {
    let cache: DefaultCache;

    beforeEach(() => {
        cache = new DefaultCache();
    });

    it('returns null when a cache key does not exist', () => {
        expect(cache.read('https://example.com', {})).toBe(null);
    });

    it('returns a stored response', () => {
        const response = getResponse('Test Body');
        const url = 'https://example.com';

        cache.write(url, {}, response);

        expect(cache.read(url, {})).toBe(response);
    });

    it('reads a specific stored response', () => {
        const response = getResponse('Test Body');
        const url = 'https://example.com';

        cache.write('/test/1', {}, getResponse('Test Body 1'));
        cache.write(url, {}, response);
        cache.write('/test/2', {}, getResponse('Test Body 2'));

        expect(cache.read(url, {})).toBe(response);
    });

    it('stores cache in different keys when giving the same url with different params', () => {
        const url = 'https://example.com';

        const firstTestResponse = getResponse('Test Body 1');
        const firstRequestOptions = { params: { testParam: 'first' } };

        const secondTestResponse = getResponse('Test Body 2');
        const secondRequestOptions = { params: { testParam: 'second' } };

        cache.write(url, firstRequestOptions, firstTestResponse);
        cache.write(url, secondRequestOptions, secondTestResponse);

        const firstCachedResponse = cache.read(url, firstRequestOptions);
        const secondCachedResponse = cache.read(url, secondRequestOptions);

        expect(firstCachedResponse).toBe(firstTestResponse);
        expect(secondCachedResponse).toBe(secondTestResponse);
    });

    it('reads the same entry when the params have a different key order', () => {
        const response = getResponse('Test Body');
        const url = 'https://example.com';

        cache.write(url, { params: { a: 1, b: [2, 3] } }, response);

        expect(cache.read(url, { params: { b: [2, 3], a: 1 } })).toBe(response);
    });

    it('uses a sorted and strictly encoded query string as the cache key', () => {
        const url = 'https://example.com';
        const getKey = (params?: object) => (cache as any).getKey(url, params);

        expect(getKey()).toEqual(url);
        expect(getKey({})).toEqual(url);
        expect(getKey({ a: undefined })).toEqual(`${url}?`);
        expect(getKey({ b: 'x y', a: null, c: [1, null, undefined], d: [], e: { f: 1 } }))
            .toEqual(`${url}?a&b=x%20y&c=1&c&e=%5Bobject%20Object%5D`);
        expect(getKey({ "!'()*": 'é' })).toEqual(`${url}?%21%27%28%29%2A=%C3%A9`);
    });
});
