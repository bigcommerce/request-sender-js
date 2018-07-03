import { Headers } from './headers';
import { RequestOptions } from './request-options';
import { Response } from './response';

const JSON_CONTENT_TYPE_REGEXP = /application\/(\w+\+)?json/;

export default class PayloadTransformer {
    toRequestBody(options: RequestOptions): any {
        const contentType = this._getHeader(options.headers, 'Content-Type');

        if (options.body && JSON_CONTENT_TYPE_REGEXP.test(contentType)) {
            return JSON.stringify(options.body);
        }

        return options.body;
    }

    toResponse(xhr: XMLHttpRequest): Response {
        const headers = this._parseResponseHeaders(xhr.getAllResponseHeaders());
        const body = this._parseResponseBody('response' in xhr ? xhr.response : (xhr as any).responseText, headers); // Using `responseText` to support legacy IE

        return {
            body,
            headers,
            status: xhr.status,
            statusText: xhr.statusText,
        };
    }

    _parseResponseBody(body: string, headers: Headers): any {
        const contentType = this._getHeader(headers, 'Content-Type');

        if (body && JSON_CONTENT_TYPE_REGEXP.test(contentType)) {
            return JSON.parse(body);
        }

        return body;
    }

    _parseResponseHeaders(rawHeaders: string): Headers {
        const lines = rawHeaders ? rawHeaders.replace(/\r?\n[\t ]+/g, ' ').split(/\r?\n/) : [];

        return lines.reduce((headers, line) => {
            const parts = line.split(':');
            const key = parts.shift().trim();

            if (!key) {
                return headers;
            }

            return {
                ...headers,
                [key.toLowerCase()]: parts.join(':').trim(),
            };
        }, {});
    }

    _getHeader(headers: Headers, key: string): string {
        if (!headers || !key) {
            return '';
        }

        return headers[key] || headers[key.toLowerCase()] || '';
    }
}
