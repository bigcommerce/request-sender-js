import { Headers } from './headers';
import Timeout from './timeout';

export interface RequestOptions {
    body?: any;
    credentials?: boolean;
    headers?: Headers;
    method?: string;
    params?: { [key: string]: any };
    timeout?: Timeout | Promise<any>;
}
