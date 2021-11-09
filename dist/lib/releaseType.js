"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseTypeError = void 0;
const seedWorks_1 = require("./seedWorks");
var ReleaseType;
(function (ReleaseType) {
    ReleaseType["PROD"] = "prod";
    ReleaseType["BETA"] = "beta";
    ReleaseType["ALPHA"] = "alpha";
    ReleaseType["RC"] = "rc";
})(ReleaseType || (ReleaseType = {}));
class ReleaseTypeError extends seedWorks_1.ErrorBase {
}
exports.ReleaseTypeError = ReleaseTypeError;
exports.default = ReleaseType;
