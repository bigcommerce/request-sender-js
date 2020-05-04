import Headers from './headers';
import Response from './response';

export function getResponse(
    body: any,
    headers: Headers = {},
    status: number = 200,
    statusText: string = 'OK'
): Response<any> {
    return {
        body,
        headers: {
            'content-type': 'application/json',
            ...headers,
        },
        status,
        statusText,
    };
}

export function getErrorResponse(
    body: any,
    headers: Headers = {},
    status: number = 400,
    statusText: string = 'Bad Request'
): Response<any> {
    return {
        body,
        headers: {
            'content-type': 'application/json',
            ...headers,
        },
        status,
        statusText,
    };
}

export function getTimeoutResponse(): Response<any> {
    return {
        body: '',
        headers: {},
        status: 0,
        statusText: '',
    };
}
