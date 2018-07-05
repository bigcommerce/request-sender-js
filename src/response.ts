import { Headers } from './headers';

export interface Response<T = any> {
    body: T;
    headers: Headers;
    status: number;
    statusText: string;
}
