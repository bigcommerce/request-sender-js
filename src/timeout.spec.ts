import Timeout from './timeout';

describe('Timeout', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('triggers callback when complete', async () => {
        const timeout = new Timeout(10);
        const callback = jest.fn();

        timeout.onComplete(callback);
        timeout.start();

        jest.advanceTimersByTime(10);
        await Promise.resolve();

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('does not trigger callback again after completion', async () => {
        const timeout = new Timeout(10);
        const callback = jest.fn();

        timeout.onComplete(callback);
        timeout.start();

        jest.advanceTimersByTime(10);
        await Promise.resolve();
        timeout.complete();

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('triggers callback after delay', async () => {
        const timeout = new Timeout(20);
        const callback = jest.fn();

        timeout.onComplete(callback);
        timeout.start();

        jest.advanceTimersByTime(10);
        await Promise.resolve();
        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(10);
        await Promise.resolve();

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('does not trigger callback again after manual completion', async () => {
        const timeout = new Timeout(10);
        const callback = jest.fn();

        timeout.onComplete(callback);
        timeout.start();
        timeout.complete();
        await Promise.resolve();

        jest.advanceTimersByTime(20);
        await Promise.resolve();

        expect(callback).toHaveBeenCalledTimes(1);
    });
});
