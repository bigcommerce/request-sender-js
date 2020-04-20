import createRequestSender from './create-request-sender';
import RequestSender from './request-sender';

describe('createRequestSender()', () => {
    it('returns instance of `RequestSender`', () => {
        expect(createRequestSender())
            .toBeInstanceOf(RequestSender);
    });
});
