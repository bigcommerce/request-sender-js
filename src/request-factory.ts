import * as queryString from 'query-string';

import Headers from './headers';
import RequestOptions from './request-options';

export default class RequestFactory {
    createRequest(url: string, options?: RequestOptions): XMLHttpRequest {
        const xhr = new XMLHttpRequest();

        this._configureRequest(xhr, url, options);

        return xhr;
    }

    private _configureRequest(xhr: XMLHttpRequest, url: string, options: RequestOptions = {}): void {
        xhr.open(options.method || 'GET', this._formatUrl(url, options.params), true);

        if (options.headers) {
            this._configureRequestHeaders(xhr, options.headers);
        }

        if (typeof options.credentials === 'boolean') {
            xhr.withCredentials = options.credentials;
        }

        if (typeof options.timeout === 'number') {
            xhr.timeout = options.timeout;
        }
    }

    private _configureRequestHeaders(xhr: XMLHttpRequest, headers: Headers): void {
        Object.keys(headers).forEach(key => {
            xhr.setRequestHeader(key, headers[key]);
        });
    }

    private _formatUrl(url: string, params?: object): string {
        if (!params || Object.keys(params).length === 0) {
            return url;
        }

        return `${url}?${queryString.stringify(params)}`;
    }
}
