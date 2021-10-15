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
 * Clone repository and switch to given ref.
 *
 * @param {string} repository - Repository name.
 * @param {string} token - GitHub token.
 * @param {string} ref - Git ref name (branch, tag).
 * @throws {ShellCommandExecutionError}
 */
const cloneRepo = ({ repository, token, ref }) => {
    core.startGroup('Clone repository');
    _cloneRepository({ repository, token });
    _switchBranchToRef({ ref });
    core.endGroup();
};
const _cloneRepository = ({ repository, token }) => {
    const cmd = `git clone https://bot:${token}@github.com/${repository}.git .`;
    const errorMessage = `Cannot clone repository '${repository}'`;
    (0, execShellCommand_1.default)({ cmd, errorMessage });
};
const _switchBranchToRef = ({ ref }) => {
    const cmd = `git switch -c ${ref}`;
    const errorMessage = `Cannot switch to branch '${ref}'`;
    (0, execShellCommand_1.default)({ cmd, errorMessage });
};
exports.default = cloneRepo;
