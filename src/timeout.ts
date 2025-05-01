export default class Timeout {
    private _promise: Promise<void>;
    private _resolve!: () => void;
    private _timeoutToken?: ReturnType<typeof setTimeout>;

    constructor(private _delay?: number) {
        this._promise = new Promise<void>(resolve => {
            this._resolve = resolve;
        });
    }

    onComplete(callback: () => void): void {
        this._promise.then(callback);
    }

    complete(): void {
        this._resolve();

        if (this._timeoutToken !== undefined) {
            clearTimeout(this._timeoutToken);
        }
    }

    start(): void {
        if (this._delay !== undefined) {
            this._timeoutToken = setTimeout(() => this.complete(), this._delay);
        }
    }
}
