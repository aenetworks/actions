"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpmrcFileError = exports.ShellCommandExecutionError = void 0;
class ErrorFactory extends Error {
    constructor(args) {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
        this.message = `${this.name}: ${args ? ': ' + args : ''}.`;
    }
}
class ShellCommandExecutionError extends ErrorFactory {
}
exports.ShellCommandExecutionError = ShellCommandExecutionError;
class NpmrcFileError extends ErrorFactory {
}
exports.NpmrcFileError = NpmrcFileError;
