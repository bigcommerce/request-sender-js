import { CookiesStatic } from 'js-cookie';
import { merge } from 'lodash';
import isPromise from './is-promise';
import PayloadTransformer from './payload-transformer';
import RequestFactory from './request-factory';
import { RequestOptions } from './request-options';
import { Response } from './response';
import Timeout from './timeout';

export default class RequestSender {
    constructor(
        private _requestFactory: RequestFactory,
        private _payloadTransformer: PayloadTransformer,
        private _cookie: CookiesStatic
    ) { }

    sendRequest(url: string, options?: RequestOptions): Promise<Response> {
        const requestOptions = this._mergeDefaultOptions(options);
        const request = this._requestFactory.createRequest(url, requestOptions);

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

    get(url: string, options?: RequestOptions): Promise<Response> {
        return this.sendRequest(url, { ...options, method: 'GET' });
    }

    post(url: string, options?: RequestOptions): Promise<Response> {
        return this.sendRequest(url, { ...options, method: 'POST' });
    }

    put(url: string, options?: RequestOptions): Promise<Response> {
        return this.sendRequest(url, { ...options, method: 'PUT' });
    }

    patch(url: string, options?: RequestOptions): Promise<Response> {
        return this.sendRequest(url, { ...options, method: 'PATCH' });
    }

    delete(url: string, options?: RequestOptions): Promise<Response> {
        return this.sendRequest(url, { ...options, method: 'DELETE' });
    }

    _mergeDefaultOptions(options: RequestOptions = {}): RequestOptions {
        const defaultOptions: Partial<RequestOptions> = {
            credentials: true,
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
        };

        const csrfToken = this._cookie.get('XSRF-TOKEN');

        if (csrfToken) {
            defaultOptions.headers['X-XSRF-TOKEN'] = csrfToken;
        }

        return merge({}, defaultOptions, options);
    }
}
