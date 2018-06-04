import * as cookie from 'js-cookie';
import PayloadTransformer from './payload-transformer';
import RequestFactory from './request-factory';
import RequestSender from './request-sender';
import Timeout from './timeout';

export function createRequestSender(): RequestSender {
    return new RequestSender(
        new RequestFactory(),
        new PayloadTransformer(),
        cookie
    );
}

export function createTimeout(delay: number): Timeout {
    return new Timeout(delay);
}
