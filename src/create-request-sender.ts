import * as cookie from 'js-cookie';

import PayloadTransformer from './payload-transformer';
import RequestFactory from './request-factory';
import RequestSender from './request-sender';
import RequestSenderOptions from './request-sender-options';

export default function createRequestSender(options?: RequestSenderOptions): RequestSender {
    return new RequestSender(
        new RequestFactory(),
        new PayloadTransformer(),
        cookie,
        options
    );
}
