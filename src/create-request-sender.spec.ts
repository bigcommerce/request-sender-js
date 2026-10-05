import createRequestSender from './create-request-sender';
import RequestSender from './request-sender';

describe('createRequestSender()', () => {
    it('returns instance of `RequestSender`', () => {
        expect(createRequestSender())
            .toBeInstanceOf(RequestSender);
    });

    describe('with the default cookie reader', () => {
        let open: jest.SpyInstance;
        let setRequestHeader: jest.SpyInstance;

        beforeEach(() => {
            open = jest.spyOn(XMLHttpRequest.prototype, 'open').mockReturnValue(undefined);
            setRequestHeader = jest.spyOn(XMLHttpRequest.prototype, 'setRequestHeader').mockReturnValue(undefined);
            jest.spyOn(XMLHttpRequest.prototype, 'send').mockReturnValue(undefined);
        });

        afterEach(() => {
            document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            jest.restoreAllMocks();
        });

        it('sends the decoded XSRF-TOKEN cookie as a header', () => {
            document.cookie = 'XSRF-TOKEN=abc%3D%3D';

            createRequestSender().get('/api/endpoint', { params: { b: 'x y', a: 1 } });

            expect(open).toHaveBeenCalledWith('GET', '/api/endpoint?a=1&b=x%20y', true);
            expect(setRequestHeader).toHaveBeenCalledWith('X-XSRF-TOKEN', 'abc==');
        });

        it('does not send the XSRF header when the cookie does not exist', () => {
            createRequestSender().get('/api/endpoint');

            expect(setRequestHeader).not.toHaveBeenCalledWith('X-XSRF-TOKEN', expect.anything());
        });
    });
});
