import * as cookie from 'js-cookie';

import PayloadTransformer from './payload-transformer';
import RequestFactory from './request-factory';
import RequestSender from './request-sender';
import { getErrorResponse, getResponse, getTimeoutResponse } from './responses.mock';

jest.mock('js-cookie', () => ({
    get: jest.fn(() => undefined),
}));

describe('RequestSender', () => {
    let payloadTransformer: PayloadTransformer;
    let request: XMLHttpRequest;
    let requestFactory: RequestFactory;
    let requestSender: RequestSender;
    let url: string;

    beforeEach(() => {
        url = 'http://foobar/v1/endpoint';
        payloadTransformer = new PayloadTransformer();
        requestFactory = new RequestFactory();
        request = new XMLHttpRequest();

        jest.spyOn(request, 'abort').mockReturnValue(undefined);
        jest.spyOn(request, 'send').mockReturnValue(undefined);
        jest.spyOn(requestFactory, 'createRequest').mockReturnValue(request);

        requestSender = new RequestSender(requestFactory, payloadTransformer, cookie);
    });

    describe('#sendRequest()', () => {
        it('creates a HTTP request with default options', () => {
            requestSender.sendRequest(url);

            expect(requestFactory.createRequest).toHaveBeenCalledWith(url, {
                credentials: true,
                encodeParams: true,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                },
                method: 'GET',
            });
        });

        it('creates a HTTP request with content-type if payload is provided', () => {
            const options = {
                body: { message: 'hello world' },
                method: 'POST',
            };

            requestSender.sendRequest(url, options);

            expect(requestFactory.createRequest).toHaveBeenCalledWith(url, {
                body: options.body,
                credentials: true,
                encodeParams: true,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
        });

        it('creates a HTTP request without content-type if payload is not provided', () => {
            requestSender.sendRequest(url, { method: 'POST' });

            expect(requestFactory.createRequest).toHaveBeenCalledWith(url, {
                credentials: true,
                encodeParams: true,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                },
                method: 'POST',
            });
        });

        it('creates a HTTP request with custom options', () => {
            const options = {
                body: 'foobar',
                credentials: false,
                encodeParams: false,
                headers: {
                    Accept: 'text/plain',
                    'Content-Type': 'text/plain',
                },
                method: 'POST',
            };

            requestSender.sendRequest(url, options);

            expect(requestFactory.createRequest).toHaveBeenCalledWith(url, options);
        });

        it('creates a HTTP request with default options unless they are overridden', () => {
            const options = {
                encodeParams: true,
                headers: {
                    Accept: 'text/plain',
                    Authorization: 'Basic YWxhZGRpbjpvcGVuc2VzYW1l',
                },
                method: 'POST',
            };

            requestSender.sendRequest(url, options);

            expect(requestFactory.createRequest).toHaveBeenCalledWith(url, {
                credentials: true,
                encodeParams: true,
                headers: {
                    Accept: 'text/plain',
                    Authorization: 'Basic YWxhZGRpbjpvcGVuc2VzYW1l',
                },
                method: 'POST',
            });
        });

        it('creates a HTTP request with CSRF token if it exists', () => {
            const mockFn = (key: string) => key === 'XSRF-TOKEN' ? 'abc' : undefined;

            /*
             * jest.Mocked has a bug with overloads
             *
             * The change that broke this was in @types/jest@23.3.14:
             * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34889
             *
             * The spyOn type is using ReturnType and when used with overloads
             * it chooses the last overload. Casting to the typeof cookie.get
             * is the fix for this issue.
             */
            jest.spyOn(cookie, 'get').mockImplementationOnce(mockFn as typeof cookie.get);

            requestSender.sendRequest(url);

            expect(requestFactory.createRequest).toHaveBeenCalledWith(url, expect.objectContaining({
                headers: expect.objectContaining({
                    'X-XSRF-TOKEN': 'abc',
                }),
            }));
        });

        it('does not create a HTTP request with CSRF token for asset requests even if it exists', () => {
            const mockFn = (key: string) => key === 'XSRF-TOKEN' ? 'abc' : undefined;

            url = 'http://foobar/script.js?time=123';

            jest.spyOn(cookie, 'get').mockImplementationOnce(mockFn as typeof cookie.get);

            requestSender.sendRequest(url);

            expect(requestFactory.createRequest).toHaveBeenCalledWith(url, expect.not.objectContaining({
                headers: {
                    'X-XSRF-TOKEN': 'abc',
                },
            }));

            expect(requestFactory.createRequest).toHaveBeenCalledWith(url, expect.objectContaining({
                headers: {
                    Accept: expect.any(String),
                },
            }));
        });

        it('sends the request with data', () => {
            const options = {
                body: { message: 'foobar' },
                method: 'POST',
            };
            const requestBody = '{"message":"foobar"}';

            jest.spyOn(payloadTransformer, 'toRequestBody').mockReturnValue(requestBody);

            requestSender.sendRequest(url, options);

            expect(payloadTransformer.toRequestBody).toHaveBeenCalledWith(expect.objectContaining(options));
            expect(request.send).toHaveBeenCalledWith(requestBody);
        });

        it('resolves with the response of the request', () => {
            const response = getResponse({ message: 'foobar' });
            const event = new ProgressEvent('load');

            jest.spyOn(payloadTransformer, 'toResponse').mockReturnValue(response);

            const promise = requestSender.sendRequest(url);

            if (request.onload) {
                request.onload(event);
            }

            expect(promise).resolves.toEqual(response);
            expect(payloadTransformer.toResponse).toHaveBeenCalledWith(request);
        });

        it('rejects with the response of the request if the server returns an error', () => {
            const response = getErrorResponse({ message: 'foobar' });
            const event = new ProgressEvent('load');

            jest.spyOn(payloadTransformer, 'toResponse').mockReturnValue(response);

            const promise = requestSender.sendRequest(url, {
                body: { message: 'foobar' },
                method: 'POST',
            });

            if (request.onload) {
                request.onload(event);
            }

            expect(promise).rejects.toEqual(response);
            expect(payloadTransformer.toResponse).toHaveBeenCalledWith(request);
        });

        it('rejects with the response of the request if it fails', () => {
            const response = getTimeoutResponse();
            const event = new ProgressEvent('error');

            jest.spyOn(payloadTransformer, 'toResponse').mockReturnValue(response);

            const promise = requestSender.sendRequest(url, {
                body: { message: 'foobar' },
                method: 'POST',
            });

            if (request.onerror) {
                request.onerror(event);
            }

            expect(promise).rejects.toEqual(response);
            expect(payloadTransformer.toResponse).toHaveBeenCalledWith(request);
        });

        it('aborts the request when resolving the `timeout` promise', async () => {
            const response = getTimeoutResponse();
            const event = new ProgressEvent('abort');

            jest.spyOn(payloadTransformer, 'toResponse').mockReturnValue(response);

            const timeout = new Promise(resolve => resolve());
            const promise = requestSender.sendRequest(url, { timeout });

            await timeout;

            if (request.onabort) {
                request.onabort(event);
            }

            expect(promise).rejects.toEqual(response);
            expect(request.abort).toHaveBeenCalled();
            expect(payloadTransformer.toResponse).toHaveBeenCalledWith(request);
        });

        it('prepends host to request URL', () => {
            const options = { host: 'https://foobar.com/' };
            const relativeUrl = '/api/endpoint';

            requestSender = new RequestSender(requestFactory, payloadTransformer, cookie, options);

            requestSender.sendRequest(relativeUrl);

            expect(requestFactory.createRequest).toHaveBeenCalledWith('https://foobar.com/api/endpoint', {
                credentials: true,
                encodeParams: true,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                },
                method: 'GET',
            });
        });

        it('does not prepend host to request URL if it is not relative URL', () => {
            const options = { host: 'https://foobar.com/' };
            const absoluteUrl = 'https://helloworld.com/api/endpoint';

            requestSender = new RequestSender(requestFactory, payloadTransformer, cookie, options);

            requestSender.sendRequest(absoluteUrl);

            expect(requestFactory.createRequest).toHaveBeenCalledWith('https://helloworld.com/api/endpoint', {
                credentials: true,
                encodeParams: true,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                },
                method: 'GET',
            });
        });

        it('caches GET requests when cache option is set', () => {
            const response = getResponse({ message: 'foobar' });
            const event = new ProgressEvent('load');

            jest.spyOn(payloadTransformer, 'toResponse').mockReturnValue(response);

            requestSender = new RequestSender(requestFactory, payloadTransformer, cookie);

            const firstPromise = requestSender.sendRequest(url, { cache: true });

            if (request.onload) {
                request.onload(event);
            }

            const secondPromise = requestSender.sendRequest(url, { cache: true });

            if (request.onload) {
                request.onload(event);
            }

            expect(firstPromise).resolves.toEqual(response);
            expect(secondPromise).resolves.toEqual(response);
            expect(requestFactory.createRequest).toHaveBeenCalledTimes(1);
        });

        it('does not cache requests when method is not GET', () => {
            const response = getResponse({ message: 'foobar' });
            const event = new ProgressEvent('load');

            jest.spyOn(payloadTransformer, 'toResponse').mockReturnValue(response);

            requestSender = new RequestSender(requestFactory, payloadTransformer, cookie);

            const firstPromise = requestSender.post(url, { cache: true });

            if (request.onload) {
                request.onload(event);
            }

            const secondPromise = requestSender.post(url, { cache: true });

            if (request.onload) {
                request.onload(event);
            }

            expect(firstPromise).resolves.toEqual(response);
            expect(secondPromise).resolves.toEqual(response);
            expect(requestFactory.createRequest).toHaveBeenCalledTimes(2);
        });

        it('uses custom Cache instance if provided', () => {
            const customCache = {
                read: jest.fn(),
                write: jest.fn(),
            };

            const options = { cache: customCache };
            const response = getResponse({ message: 'foobar' });
            const event = new ProgressEvent('load');

            jest.spyOn(payloadTransformer, 'toResponse').mockReturnValue(response);

            requestSender = new RequestSender(requestFactory, payloadTransformer, cookie, options);

            const promise = requestSender.sendRequest(url, { cache: true });

            if (request.onload) {
                request.onload(event);
            }

            expect(promise).resolves.toEqual(response);
            expect(customCache.read).toHaveBeenCalled();
            expect(customCache.write).toHaveBeenCalled();
        });
    });

    describe('#get()', () => {
        it('sends a GET request', () => {
            jest.spyOn(requestSender, 'sendRequest');

            requestSender.get(url);

            expect(requestSender.sendRequest).toHaveBeenCalledWith(url, { method: 'GET' });
        });
    });

    describe('#post()', () => {
        it('sends a POST request', () => {
            jest.spyOn(requestSender, 'sendRequest');

            requestSender.post(url);

            expect(requestSender.sendRequest).toHaveBeenCalledWith(url, { method: 'POST' });
        });
    });

    describe('#put()', () => {
        it('sends a PUT request', () => {
            jest.spyOn(requestSender, 'sendRequest');

            requestSender.put(url);

            expect(requestSender.sendRequest).toHaveBeenCalledWith(url, { method: 'PUT' });
        });
    });

    describe('#patch()', () => {
        it('sends a PATCH request', () => {
            jest.spyOn(requestSender, 'sendRequest');

            requestSender.patch(url);

            expect(requestSender.sendRequest).toHaveBeenCalledWith(url, { method: 'PATCH' });
        });
    });

    describe('#delete()', () => {
        it('sends a DELETE request', () => {
            jest.spyOn(requestSender, 'sendRequest');

            requestSender.delete(url);

            expect(requestSender.sendRequest).toHaveBeenCalledWith(url, { method: 'DELETE' });
        });
    });
});
