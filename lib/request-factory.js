"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryString = require("query-string");
var RequestFactory = (function () {
    function RequestFactory() {
    }
    RequestFactory.prototype.createRequest = function (url, options) {
        if (options === void 0) { options = {}; }
        var xhr = new XMLHttpRequest();
        this._configureRequest(xhr, url, options);
        return xhr;
    };
    RequestFactory.prototype._configureRequest = function (xhr, url, options) {
        xhr.open(options.method, this._formatUrl(url, options.params), true);
        this._configureRequestHeaders(xhr, options.headers);
        if (typeof options.credentials === 'boolean') {
            xhr.withCredentials = options.credentials;
        }
        if (typeof options.timeout === 'number') {
            xhr.timeout = options.timeout;
        }
    };
    RequestFactory.prototype._configureRequestHeaders = function (xhr, headers) {
        if (!headers) {
            return;
        }
        Object.keys(headers).forEach(function (key) {
            xhr.setRequestHeader(key, headers[key]);
        });
    };
    RequestFactory.prototype._formatUrl = function (url, params) {
        if (!params || Object.keys(params).length === 0) {
            return url;
        }
        return url + "?" + queryString.stringify(params);
    };
    return RequestFactory;
}());
exports.default = RequestFactory;
//# sourceMappingURL=request-factory.js.map