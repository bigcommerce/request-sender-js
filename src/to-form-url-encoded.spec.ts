import toFormUrlEncoded from './to-form-url-encoded';

describe('toFormUrlEncoded()', () => {
    it('encodes given object to url encoded string', () => {
        const data = {
            A: 'A',
            B: 'B',
        };

        expect(toFormUrlEncoded(data))
            .toEqual('A=A&B=B');
    });

    it('encodes nested object to url encoded string', () => {
        const data = {
            A: 'A',
            B: {
                value: 'B',
            },
        };

        expect(toFormUrlEncoded(data))
            .toEqual('A=A&B=%7B%22value%22%3A%22B%22%7D');
    });

    it('does not do anything if data is already encoded', () => {
        const data = 'A=A&B=B';

        expect(toFormUrlEncoded(data))
            .toEqual(data);
    });
});
