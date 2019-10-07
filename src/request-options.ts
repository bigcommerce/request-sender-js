import Headers from './headers';
import Timeout from './timeout';

export default interface RequestOptions {
    body?: any;
    cache?: boolean;
    credentials?: boolean;
    headers?: Headers;
    method?: string;
    params?: { [key: string]: any };
    timeout?: Timeout | Promise<any>;
}
