import { CookiesStatic } from 'js-cookie';
import merge from 'lodash/merge';

import Cache, { DefaultCache } from './cache';
import isPromise from './is-promise';
import PayloadTransformer from './payload-transformer';
import RequestFactory from './request-factory';
import RequestOptions from './request-options';
import RequestSenderOptions from './request-sender-options';
import Response from './response';
import Timeout from './timeout';

export default class RequestSender {
    private _cache: Cache;

    constructor(
        private _requestFactory: RequestFactory,
        private _payloadTransformer: PayloadTransformer,
        private _cookie: CookiesStatic,
        private _options: RequestSenderOptions = {}
    ) {
        this._cache = this._options.cache || new DefaultCache();
    }

    sendRequest<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
        const requestOptions = this._mergeDefaultOptions(url, options);
        const cachedRequest = this._getCachedRequest<T>(url, requestOptions);

        if (cachedRequest) {
            return Promise.resolve(cachedRequest);
        }

        const request = this._requestFactory.createRequest(this._prependHost(url), requestOptions);

        return new Promise((resolve, reject) => {
            const requestHandler = () => {
                const response = this._payloadTransformer.toResponse(request);

                if (response.status >= 200 && response.status < 300) {
                    this._cacheRequest(url, requestOptions, response);
                    resolve(response);
                } else {
                    reject(response);
                }
            };

            request.onload = requestHandler;
            request.onerror = requestHandler;
            request.onabort = requestHandler;
            request.ontimeout = requestHandler;

            if (requestOptions.timeout instanceof Timeout) {
                requestOptions.timeout.onComplete(() => request.abort());
                requestOptions.timeout.start();
            }

            if (isPromise(requestOptions.timeout)) {
                requestOptions.timeout.then(() => request.abort());
            }

            request.send(this._payloadTransformer.toRequestBody(requestOptions));
        });
    }

    get<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
        return this.sendRequest(url, { ...options, method: 'GET' });
    }

    post<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
        return this.sendRequest(url, { ...options, method: 'POST' });
    }

    put<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
        return this.sendRequest(url, { ...options, method: 'PUT' });
    }

    patch<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
        return this.sendRequest(url, { ...options, method: 'PATCH' });
    }

    delete<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
        return this.sendRequest(url, { ...options, method: 'DELETE' });
    }

    private _mergeDefaultOptions(url: string, options?: RequestOptions): RequestOptions {
        const defaultOptions: Partial<RequestOptions> = {
            credentials: true,
            encodeParams: true,
            headers: {
                Accept: 'application/json, text/plain, */*',
            },
            method: 'GET',
        };

        const csrfToken = this._cookie.get('XSRF-TOKEN');

        if (csrfToken && defaultOptions.headers && !this._isAssetRequest(url, options)) {
            defaultOptions.headers['X-XSRF-TOKEN'] = csrfToken;
        }

        if (options && options.body && defaultOptions.headers) {
            defaultOptions.headers['Content-Type'] = 'application/json';
        }

        return merge({}, defaultOptions, options);
    }

    private _prependHost(url: string): string {
        if (!this._options.host || /^https?:\/\//.test(url)) {
            return url;
        }

        return `${this._options.host.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    }

    private _shouldCacheRequest(options: RequestOptions): boolean {
        const method = options.method || 'GET';

        return method.toUpperCase() === 'GET' && Boolean(options.cache);
    }

    private _getCachedRequest<T>(url: string, options: RequestOptions): Response<T> | null {
        if (this._shouldCacheRequest(options)) {
            return this._cache.read<T>(url, options);
        }

        return null;
    }

    private _cacheRequest<T>(url: string, options: RequestOptions, response: Response<T>): void {
        if (this._shouldCacheRequest(options)) {
            this._cache.write(url, options, response);
        }
    }

    private _isAssetRequest(url: string, options?: RequestOptions): boolean {
        if (options && options.method && options.method.toUpperCase() !== 'GET') {
            return false;
        }

        return /\.(png|gif|jpe?g|css|js|json|svg|html?)$/.test(url.split('?')[0]);
    }
}
