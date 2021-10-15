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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const execShellCommand_1 = __importDefault(require("../execShellCommand"));
/**
 * Set up git bot user.
 *
 * @param {string} name - Git user.name.
 * @param {email} email - Git user.email.
 * @throws {ShellCommandExecutionError}
 */
const setupGitUser = ({ name, email }) => {
    core.startGroup('Setup bot');
    _setGitUserName({ name });
    _setGitUserEmail({ email });
    core.endGroup();
};
const _setGitUserName = ({ name }) => {
    console.debug(`Name: ${name}`);
    const cmd = `git config user.name "${name}"`;
    const errorMessage = `Cannot set git user.name=${name}`;
    (0, execShellCommand_1.default)({
        cmd,
        errorMessage,
    });
};
const _setGitUserEmail = ({ email }) => {
    console.debug(`Email: ${email}`);
    const cmd = `git config user.email "<${email}>"`;
    const errorMessage = `Cannot set git user.email=${email}`;
    (0, execShellCommand_1.default)({ cmd, errorMessage });
};
exports.default = setupGitUser;
