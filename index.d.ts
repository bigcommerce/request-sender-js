/**
 * Use a definition file for now until we have time to convert the source code
 * into TypeScript
 */

export function createRequestSender(): RequestSender;

export function createTimeout(delay?: number): Timeout;

export interface RequestSender {
    sendRequest<T = any>(url: string, options: RequestOptions): Promise<Response<T>>;
    get<T = any>(url: string, options: RequestOptions): Promise<Response<T>>;
    post<T = any>(url: string, options: RequestOptions): Promise<Response<T>>;
    put<T = any>(url: string, options: RequestOptions): Promise<Response<T>>;
    patch<T = any>(url: string, options: RequestOptions): Promise<Response<T>>;
    delete<T = any>(url: string, options: RequestOptions): Promise<Response<T>>;
}

export interface Response<T = any> {
    body: T;
    headers: { [key: string]: any; };
    status: number;
    statusText: string;
}

export interface RequestOptions {
    body?: any;
    credentials?: boolean;
    headers?: { [key: string]: any };
    method?: string;
    params?: { [key: string]: any };
    timeout?: Timeout;
}

export interface Timeout {
    start(): void;
    complete(): void;
    onComplete(callback: () => void): void;
}
