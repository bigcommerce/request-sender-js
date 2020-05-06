import Headers from './headers';
import RequestOptions from './request-options';
import Response from './response';
import toFormUrlEncoded from './to-form-url-encoded';

const JSON_CONTENT_TYPE_REGEXP = /application\/(\w+\+)?json/;
const FORM_URLENCODED_CONTENT_TYPE_REGEXP = /application\/x-www-form-urlencoded/;

export default class PayloadTransformer {
    toRequestBody(options: RequestOptions): any {
        const contentType = options.headers ? this._getHeader(options.headers, 'Content-Type') : '';

        if (options.body) {
            if (JSON_CONTENT_TYPE_REGEXP.test(contentType)) {
                return JSON.stringify(options.body);
            }

            if (FORM_URLENCODED_CONTENT_TYPE_REGEXP.test(contentType)) {
                return toFormUrlEncoded(options.body);
            }
        }

        return options.body;
    }

    toResponse<T = unknown>(xhr: XMLHttpRequest): Response<T> {
        const headers = this._parseResponseHeaders(xhr.getAllResponseHeaders());

        // Using `responseText` to support legacy IE
        const body = this._parseResponseBody(
            'response' in xhr ? xhr.response : (xhr as any).responseText,
            headers
        );

        return {
            body,
            headers,
            status: xhr.status,
            statusText: xhr.statusText,
        };
    }

    private _parseResponseBody(body: string, headers: Headers): any {
        const contentType = this._getHeader(headers, 'Content-Type');

        if (body && JSON_CONTENT_TYPE_REGEXP.test(contentType)) {
            return JSON.parse(body);
        }

        return body;
    }

    private _parseResponseHeaders(rawHeaders: string): Headers {
        const lines = rawHeaders ? rawHeaders.replace(/\r?\n[\t ]+/g, ' ').split(/\r?\n/) : [];

        return lines.reduce((headers, line) => {
            const parts = line.split(':');
            const key = (parts.shift() || '').trim();

            if (!key) {
                return headers;
            }

            return {
                ...headers,
                [key.toLowerCase()]: parts.join(':').trim(),
            };
        }, {});
    }

    private _getHeader(headers: Headers, key: string): string {
        if (!headers || !key) {
            return '';
        }

        return headers[key] || headers[key.toLowerCase()] || '';
    }
}
