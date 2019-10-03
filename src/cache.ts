import * as queryString from 'query-string';

import RequestOptions from './request-options';
import Response from './response';

export default interface Cache {
    read<T>(url: string, options: RequestOptions): Response<T> | null;
    write<T>(url: string, options: RequestOptions, response: Response<T>): void;
}

interface CacheMap {
    [key: string]: Response<any>;
}

export class DefaultCache implements Cache {
    private readonly _cache: CacheMap = {};

    read<T>(url: string, options: RequestOptions): Response<T> | null {
        const cacheKey = this.getKey(url, options.params);

        return this._cache[cacheKey] || null;
    }

    write<T>(url: string, options: RequestOptions, response: Response<T>) {
        const cacheKey = this.getKey(url, options.params);

        this._cache[cacheKey] = response;
    }

    private getKey(url: string, params: object = {}) {
        if (Object.keys(params).length === 0) {
            return url;
        }

        return `${url}?${queryString.stringify(params)}`;
    }
}
