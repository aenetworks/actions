"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellCommandExecutionError = void 0;
class ErrorFactory extends Error {
    constructor(args) {
        super();
        this._msg = '';
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
        this._msg = this.constructor['msg'];
        this.message = this.getMessage(args);
    }
    getMessage(args) {
        if (!!this._msg && !!args) {
            return `${this._msg}: ${args}.`;
        }
        if (!!this._msg) {
            return `${this._msg}.`;
        }
        if (!!args) {
            return `${args}.`;
        }
        return '';
    }
}
class ShellCommandExecutionError extends ErrorFactory {
}
exports.ShellCommandExecutionError = ShellCommandExecutionError;
