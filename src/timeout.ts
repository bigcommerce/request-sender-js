export default class Timeout {
    private _timeoutToken?: number;
    private _promise: Promise<any>;
    private _resolve: () => void;

    constructor(
        private _delay?: number
    ) {
        this._promise = new Promise((resolve) => {
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

