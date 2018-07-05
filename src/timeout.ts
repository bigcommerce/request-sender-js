export default class Timeout {
    private _promise: Promise<any>;
    private _resolve: () => void;
    private _timeoutToken?: number;

    constructor(
        private _delay?: number
    ) {
        // tslint:disable-next-line:no-empty
        this._resolve = () => {};

        this._promise = new Promise(resolve => {
            this._resolve = resolve;
        });
    }

    onComplete(callback: () => void): void {
        this._promise.then(callback);
    }

    complete(): void {
        this._resolve();

        if (this._timeoutToken) {
            window.clearTimeout(this._timeoutToken);
        }
    }

    start(): void {
        if (this._delay) {
            this._timeoutToken = window.setTimeout(() => this.complete(), this._delay);
        }
    }
}
