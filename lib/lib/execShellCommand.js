"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellCommandExecutionError = void 0;
const core = __importStar(require("@actions/core"));
const shell = __importStar(require("shelljs"));
const seedWorks_1 = require("./seedWorks");
/**
 * Error while executing shell command.
 */
class ShellCommandExecutionError extends seedWorks_1.ErrorBase {
}
exports.ShellCommandExecutionError = ShellCommandExecutionError;
/**
 * Execute shell command.
 *
 * @param {string} cmd - Command to execute.
 * @param {string} [errorMessage=''] - Error message used to throw error.
 * @param {boolean} [useStdout=false] - Should use Stdout instead Stderr to describe error details.
 * @return {string} - Command output.
 * @throws {ShellCommandExecutionError} - Command execution error.
 */
const execShellCommand = ({ cmd, errorMessage = '', useStdout = false }) => {
    core.debug(`Running command: \`${cmd}\``);
    const res = shell.exec(cmd);
    if (res.code) {
        const errorDescription = useStdout ? res.stdout : res.stderr;
        throw new ShellCommandExecutionError(`${errorMessage}\n${errorDescription}`);
    }
    return res.stdout;
};
exports.default = execShellCommand;
