import Headers from './headers';

export default interface Response<T> {
    body: T;
    headers: Headers;
    status: number;
    statusText: string;
}
