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
const core = __importStar(require("@actions/core"));
const shell = __importStar(require("shelljs"));
/**
 * Clone repository and switch to given ref.
 *
 * @param {string} repository - Repository name.
 * @param {string} token - GitHub token.
 * @param {string} ref - Git ref name (branch, tag).
 */
const cloneRepo = ({ repository, token, ref }) => {
    core.startGroup('Clone repository');
    _cloneRepository({ repository, token });
    _switchBranchToRef({ ref });
    core.endGroup();
};
const _cloneRepository = ({ repository, token }) => {
    const cmd = `git clone https://bot:${token}@github.com/${repository}.git .`;
    const res = shell.exec(cmd, { fatal: true });
    if (res.code) {
        throw new Error(`Cannot clone repository '${repository}':\n${res.stdout}`);
    }
};
const _switchBranchToRef = ({ ref }) => {
    const cmd = `git switch -c ${ref}`;
    const res = shell.exec(cmd, { fatal: true });
    if (res.code) {
        throw new Error(`Cannot switch to branch '${ref}':\n${res.stdout}`);
    }
};
exports.default = cloneRepo;
