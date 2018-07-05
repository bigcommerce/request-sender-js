import Headers from './headers';

export default interface Response<T = any> {
    body: T;
    headers: Headers;
    status: number;
    statusText: string;
}
