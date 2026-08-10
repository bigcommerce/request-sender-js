import isPromise from './is-promise';

describe('isPromise()', () => {
    it('returns true for a native Promise', () => {
        expect(isPromise(Promise.resolve())).toBe(true);
    });

    it('returns true for a thenable object', () => {
        expect(isPromise({ then: jest.fn() })).toBe(true);
    });

    it('returns true for a thenable function', () => {
        const thenable: any = jest.fn();

        thenable.then = jest.fn();

        expect(isPromise(thenable)).toBe(true);
    });

    it('returns false for null', () => {
        expect(isPromise(null)).toBe(false);
    });

    it('returns false for undefined', () => {
        expect(isPromise(undefined)).toBe(false);
    });

    it('returns false for a plain object without a `then` function', () => {
        expect(isPromise({})).toBe(false);
    });

    it('returns false for a primitive value', () => {
        expect(isPromise('foobar')).toBe(false);
    });

    it('returns false for an object whose `then` property is not a function', () => {
        expect(isPromise({ then: 'not a function' })).toBe(false);
    });
});
