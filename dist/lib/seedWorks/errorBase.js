"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorBase extends Error {
    constructor(args) {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
        this.message = `${args}`;
    }
}
exports.default = ErrorBase;
