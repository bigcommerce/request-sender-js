import createTimeout from './create-timeout';
import Timeout from './timeout';

describe('createTimeout()', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    it('returns a Timeout instance', () => {
        expect(createTimeout()).toBeInstanceOf(Timeout);
    });

    it('creates a timeout that completes after the given delay', async () => {
        jest.useFakeTimers();

        const callback = jest.fn();
        const timeout = createTimeout(10);

        timeout.onComplete(callback);
        timeout.start();

        jest.advanceTimersByTime(10);
        await Promise.resolve();

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('creates a timeout that only completes when triggered manually if no delay is given', async () => {
        const callback = jest.fn();
        const timeout = createTimeout();

        timeout.onComplete(callback);
        timeout.start();

        await Promise.resolve();

        expect(callback).not.toHaveBeenCalled();

        timeout.complete();
        await Promise.resolve();

        expect(callback).toHaveBeenCalledTimes(1);
    });
});
