import * as queryString from 'query-string';
import { Headers } from './headers';
import { RequestOptions } from './request-options';

export default class RequestFactory {
    createRequest(url: string, options: RequestOptions = {}): XMLHttpRequest {
        const xhr = new XMLHttpRequest();

        this._configureRequest(xhr, url, options);

        return xhr;
    }

    _configureRequest(xhr: XMLHttpRequest, url: string, options: RequestOptions): void {
        xhr.open(options.method, this._formatUrl(url, options.params), true);

        this._configureRequestHeaders(xhr, options.headers);

        if (typeof options.credentials === 'boolean') {
            xhr.withCredentials = options.credentials;
        }

        if (typeof options.timeout === 'number') {
            xhr.timeout = options.timeout;
        }
    }

    _configureRequestHeaders(xhr: XMLHttpRequest, headers: Headers): void {
        if (!headers) {
            return;
        }

        Object.keys(headers).forEach((key) => {
            xhr.setRequestHeader(key, headers[key]);
        });
    }

    _formatUrl(url: string, params: Object): string {
        if (!params || Object.keys(params).length === 0) {
            return url;
        }

        return `${url}?${queryString.stringify(params)}`;
    }
}
