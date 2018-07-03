import { Headers } from './headers';
import { Response } from './response';

export function getResponse(
    body: any,
    headers: Headers = {},
    status: number = 200,
    statusText: string = 'OK'
): Response {
    return {
        body,
        status,
        statusText,
        headers: {
            'content-type': 'application/json',
            ...headers,
        },
    };
}

export function getErrorResponse(
    body: any,
    headers: Headers = {},
    status: number = 400,
    statusText: string = 'Bad Request'
): Response {
    return {
        body,
        status,
        statusText,
        headers: {
            'content-type': 'application/json',
            ...headers,
        },
    };
}

export function getTimeoutResponse(): Response {
    return {
        body: '',
        headers: {},
        status: 0,
        statusText: '',
    };
}
