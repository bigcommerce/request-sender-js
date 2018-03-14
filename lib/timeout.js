"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Timeout = (function () {
    function Timeout(delay) {
        var _this = this;
        this._delay = delay;
        this._timeoutToken = null;
        this._promise = new Promise(function (resolve) {
            _this._resolve = resolve;
        });
    }
    Timeout.prototype.onComplete = function (callback) {
        this._promise.then(callback);
    };
    Timeout.prototype.complete = function () {
        this._resolve();
        if (this._timeoutToken) {
            clearTimeout(this._timeoutToken);
        }
    };
    Timeout.prototype.start = function () {
        var _this = this;
        if (this._delay) {
            this._timeoutToken = setTimeout(function () { return _this.complete(); }, this._delay);
        }
    };
    return Timeout;
}());
exports.default = Timeout;
//# sourceMappingURL=timeout.js.map