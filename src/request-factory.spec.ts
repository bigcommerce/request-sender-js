import RequestFactory from './request-factory';

describe('RequestFactory', () => {
    let requestFactory: RequestFactory;
    let url: string;

    beforeEach(() => {
        url = 'http://foobar/v1/endpoint';

        (global as any).XMLHttpRequest = function XMLHttpRequestMock() {
            this.open = jest.fn();
            this.setRequestHeader = jest.fn();
        };

        requestFactory = new RequestFactory();
    });

    describe('#createRequest()', () => {
        it('returns XHR object', () => {
            const xhr = requestFactory.createRequest(url);

            expect(xhr instanceof XMLHttpRequest).toEqual(true);
        });

        it('configures XHR object with options', () => {
            const xhr = requestFactory.createRequest(url, {
                credentials: true,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                timeout: 2000,
            } as any);

            expect(xhr.withCredentials).toEqual(true);
            expect(xhr.timeout).toEqual(2000);
            expect(xhr.open).toHaveBeenCalledWith('GET', url, true);
            expect(xhr.setRequestHeader).toHaveBeenCalledWith('Accept', 'application/json, text/plain, */*');
            expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        });

        it('configures XHR object with encoded parameterized URL', () => {
            const xhr = requestFactory.createRequest(url, {
                method: 'GET',
                params: {
                    bar: 'bar',
                    foo: 'foo',
                    foobar: 'foo,bar',
                },
            });

            expect(xhr.open).toHaveBeenCalledWith('GET', `${url}?bar=bar&foo=foo&foobar=foo%2Cbar`, true);
        });

        it('configures XHR object with unencoded paramterized URL', () => {
            const xhr = requestFactory.createRequest(url, {
                encodeParams: false,
                method: 'GET',
                params: {
                    bar: 'bar',
                    foo: 'foo',
                    foobar: 'foo,bar',
                },
            });

            expect(xhr.open).toHaveBeenCalledWith('GET', `${url}?bar=bar&foo=foo&foobar=foo,bar`, true);
        });

        describe('query string format', () => {
            const formatUrl = (params: { [key: string]: any }, encodeParams?: boolean) => {
                const xhr = requestFactory.createRequest(url, { encodeParams, params });

                return (xhr.open as jest.Mock).mock.calls[0][1];
            };

            it('does not add a query string when params are empty', () => {
                expect(formatUrl({})).toEqual(url);
            });

            it('sorts keys by their string value', () => {
                expect(formatUrl({ b: 1, a: 2, B: 3, 10: 4, 2: 5, _: 6 }))
                    .toEqual(`${url}?10=4&2=5&B=3&_=6&a=2&b=1`);
            });

            it('adds only the key when the value is null', () => {
                expect(formatUrl({ a: null, b: 'x' })).toEqual(`${url}?a&b=x`);
            });

            it('skips keys whose value is undefined', () => {
                expect(formatUrl({ a: undefined, b: 'x' })).toEqual(`${url}?b=x`);
            });

            it('keeps the separator when every value is undefined', () => {
                expect(formatUrl({ a: undefined })).toEqual(`${url}?`);
            });

            it('keeps empty strings', () => {
                expect(formatUrl({ a: '', b: 'x' })).toEqual(`${url}?a=&b=x`);
            });

            it('converts numbers and booleans to strings', () => {
                expect(formatUrl({ a: 0, b: 1.5, c: true, d: false, e: -1 }))
                    .toEqual(`${url}?a=0&b=1.5&c=true&d=false&e=-1`);
            });

            it('repeats the key for each array item', () => {
                expect(formatUrl({ a: [1, 'x y', null, undefined, ''], b: 'z' }))
                    .toEqual(`${url}?a=1&a=x%20y&a&a=&b=z`);
            });

            it('skips empty arrays', () => {
                expect(formatUrl({ a: [], b: 'x' })).toEqual(`${url}?b=x`);
                expect(formatUrl({ a: [] })).toEqual(`${url}?`);
                expect(formatUrl({ a: [undefined] })).toEqual(`${url}?`);
            });

            it('converts nested objects and nested arrays to strings', () => {
                expect(formatUrl({ a: { b: 1 }, c: [[1, 2]], d: [{ e: 1 }] }))
                    .toEqual(`${url}?a=%5Bobject%20Object%5D&c=1%2C2&d=%5Bobject%20Object%5D`);
            });

            it('encodes reserved characters in keys and values with strict URI encoding', () => {
                expect(formatUrl({ 'k y&=': `!'()*~-_. &=?#/+%,;:@$`, unicode: 'é中' }))
                    .toEqual([
                        `${url}?k%20y%26%3D=%21%27%28%29%2A~-_.%20%26%3D%3F%23%2F%2B%25%2C%3B%3A%40%24`,
                        'unicode=%C3%A9%E4%B8%AD',
                    ].join('&'));
            });

            it('does not encode keys and values when encoding is off', () => {
                const params = { 'k y': `!'() &=é`, a: null, b: undefined, c: [1, 'x y', null], d: { e: 1 }, f: [] };

                expect(formatUrl(params, false))
                    .toEqual(`${url}?a&c=1&c=x y&c&d=[object Object]&k y=!'() &=é`);
            });

            it('does not add a leading question mark to the values', () => {
                expect(formatUrl({ '?a': '?b' })).toEqual(`${url}?%3Fa=%3Fb`);
            });
        });

        it('configures XHR object without null headers', () => {
            const xhr = requestFactory.createRequest(url, {
                credentials: false,
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': null,
                    Authorization: 'auth_key',
                },
            });

            expect(xhr.withCredentials).toEqual(false);
            expect(xhr.open).toHaveBeenCalledWith('POST', url, true);
            expect(xhr.setRequestHeader).toHaveBeenCalledWith('Accept', 'application/json, text/plain, */*');
            expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
            expect(xhr.setRequestHeader).not.toHaveBeenCalledWith('X-XSRF-TOKEN', null);
            expect(xhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'auth_key');
        });
    });
});
