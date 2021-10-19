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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const decorators_1 = require("../decorators");
const execShellCommand_1 = __importDefault(require("../execShellCommand"));
class CloneRepository {
    /**
     * Construct CloneRepository command.
     *
     * @param {string} repository - Repository name.
     * @param {string} token - GitHub token.
     * @param {string} ref - Git ref name (branch, tag).
     */
    constructor(repository, token, ref) {
        this.repository = repository;
        this.token = token;
        this.ref = ref;
        this._cloneRepository = (repository, token) => {
            const cmd = `git clone https://bot:${token}@github.com/${repository}.git .`;
            const errorMessage = `Cannot clone repository '${repository}'`;
            (0, execShellCommand_1.default)({ cmd, errorMessage });
        };
        this._switchBranchToRef = (ref) => {
            try {
                const cmd = `git checkout ${ref}`;
                (0, execShellCommand_1.default)({ cmd });
                core.info(`Checkout to '${ref}'`);
            }
            catch (e) {
                const cmd = `git switch -c ${ref}`;
                const errorMessage = `Cannot switch to branch '${ref}'`;
                (0, execShellCommand_1.default)({ cmd, errorMessage });
                core.info(`Switched to branch '${ref}'`);
            }
        };
    }
    /**
     * Run command.
     *
     * @throws {ShellCommandExecutionError}
     */
    run() {
        core.info(`Cloning repository ${this.repository}`);
        this._cloneRepository(this.repository, this.token);
        this._switchBranchToRef(this.ref);
    }
}
__decorate([
    (0, decorators_1.logGroup)('Clone repository')
], CloneRepository.prototype, "run", null);
exports.default = CloneRepository;
