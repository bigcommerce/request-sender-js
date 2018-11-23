import { CookiesStatic } from 'js-cookie';
import { merge } from 'lodash';

import isPromise from './is-promise';
import PayloadTransformer from './payload-transformer';
import RequestFactory from './request-factory';
import RequestOptions from './request-options';
import RequestSenderOptions from './request-sender-options';
import Response from './response';
import Timeout from './timeout';

export default class RequestSender {
    constructor(
        private _requestFactory: RequestFactory,
        private _payloadTransformer: PayloadTransformer,
        private _cookie: CookiesStatic,
        private _options?: RequestSenderOptions
    ) {}

    sendRequest<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
        const requestOptions = this._mergeDefaultOptions(options);
        const request = this._requestFactory.createRequest(this._prependHost(url), requestOptions);

        return new Promise((resolve, reject) => {
            const requestHandler = () => {
                const response = this._payloadTransformer.toResponse(request);

                if (response.status >= 200 && response.status < 300) {
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

    private _mergeDefaultOptions(options?: RequestOptions): RequestOptions {
        const defaultOptions: Partial<RequestOptions> = {
            credentials: true,
            headers: {
                Accept: 'application/json, text/plain, */*',
            },
            method: 'GET',
        };

        const csrfToken = this._cookie.get('XSRF-TOKEN');

        if (csrfToken && defaultOptions.headers) {
            defaultOptions.headers['X-XSRF-TOKEN'] = csrfToken;
        }

        if (options && options.body && defaultOptions.headers) {
            defaultOptions.headers['Content-Type'] = 'application/json';
        }

        return merge({}, defaultOptions, options);
    }

    private _prependHost(url: string): string {
        if (!this._options || !this._options.host || /^https?:\/\//.test(url)) {
            return url;
        }

        return `${this._options.host.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    }
}
