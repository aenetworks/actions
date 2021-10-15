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
        this.message = `${this.name}: ${this._msg}${args ? ': ' + args : ''}.`;
    }
}
class ShellCommandExecutionError extends ErrorFactory {
}
exports.ShellCommandExecutionError = ShellCommandExecutionError;
