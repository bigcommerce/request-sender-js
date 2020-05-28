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
