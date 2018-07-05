import * as cookie from 'js-cookie';

import PayloadTransformer from './payload-transformer';
import RequestFactory from './request-factory';
import RequestSender from './request-sender';

export default function createRequestSender(): RequestSender {
    return new RequestSender(
        new RequestFactory(),
        new PayloadTransformer(),
        cookie
    );
}
