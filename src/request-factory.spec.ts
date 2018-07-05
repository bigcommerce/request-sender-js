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

        it('configures XHR object with parameterized URL', () => {
            const xhr = requestFactory.createRequest(url, {
                method: 'GET',
                params: {
                    bar: 'bar',
                    foobar: 'foobar',
                },
            });

            expect(xhr.open).toHaveBeenCalledWith('GET', `${url}?bar=bar&foobar=foobar`, true);
        });
    });
});
