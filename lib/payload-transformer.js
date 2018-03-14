"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var JSON_CONTENT_TYPE_REGEXP = /application\/(\w+\+)?json/;
var PayloadTransformer = (function () {
    function PayloadTransformer() {
    }
    PayloadTransformer.prototype.toRequestBody = function (options) {
        var contentType = this._getHeader(options.headers, 'Content-Type');
        if (options.body && JSON_CONTENT_TYPE_REGEXP.test(contentType)) {
            return JSON.stringify(options.body);
        }
        return options.body;
    };
    PayloadTransformer.prototype.toResponse = function (xhr) {
        var headers = this._parseResponseHeaders(xhr.getAllResponseHeaders());
        var body = this._parseResponseBody('response' in xhr ? xhr.response : xhr.responseText, headers);
        return {
            body: body,
            headers: headers,
            status: xhr.status,
            statusText: xhr.statusText,
        };
    };
    PayloadTransformer.prototype._parseResponseBody = function (body, headers) {
        var contentType = this._getHeader(headers, 'Content-Type');
        if (body && JSON_CONTENT_TYPE_REGEXP.test(contentType)) {
            return JSON.parse(body);
        }
        return body;
    };
    PayloadTransformer.prototype._parseResponseHeaders = function (rawHeaders) {
        var lines = rawHeaders ? rawHeaders.replace(/\r?\n[\t ]+/g, ' ').split(/\r?\n/) : [];
        return lines.reduce(function (headers, line) {
            var parts = line.split(':');
            var key = parts.shift().trim();
            if (!key) {
                return headers;
            }
            return tslib_1.__assign({}, headers, (_a = {}, _a[key.toLowerCase()] = parts.join(':').trim(), _a));
            var _a;
        }, {});
    };
    PayloadTransformer.prototype._getHeader = function (headers, key) {
        if (!headers || !key) {
            return '';
        }
        return headers[key] || headers[key.toLowerCase()] || '';
    };
    return PayloadTransformer;
}());
exports.default = PayloadTransformer;
//# sourceMappingURL=payload-transformer.js.map