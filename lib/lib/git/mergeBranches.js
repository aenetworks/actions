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
class MergeBranches {
    /**
     * Construct MergeBranches command.
     *
     * @param {string} targetRef - Branch which will be updated.
     * @param {string|MergeBranches.LAST_TAG} sourceRef - Branch, tag or `MergeBranches.LAST_TAG`. Describes which code will be merged into
     *  targetRef. If set to 'MergeBranches.LAST_TAG' - last tag will be detected.
     * @param {boolean} force - Flag to force push.
     */
    constructor(targetRef, sourceRef, force = false) {
        this.targetRef = targetRef;
        this.force = force;
        this._checkout = (targetRef) => {
            const cmd = `git checkout ${targetRef}`;
            const errorMessage = `Cannot checkout to '${targetRef}'`;
            (0, execShellCommand_1.default)({ cmd, errorMessage });
        };
        this._mergeBranches = (sourceRef, targetRef, isTag) => {
            const source = isTag ? sourceRef : 'origin/' + sourceRef;
            const cmd = `git merge --ff-only ${source}`;
            const errorMessage = `Cannot merge '${sourceRef}' into '${targetRef}'`;
            (0, execShellCommand_1.default)({ cmd, errorMessage });
        };
        this._pushTargetBranch = (targetRef, isForce) => {
            const cmd = `git push --set-upstream origin ${targetRef}${isForce ? ' --force' : ''}`;
            const errorMessage = `Cannot push '${targetRef}'`;
            (0, execShellCommand_1.default)({ cmd, errorMessage });
        };
        this._isTagRef = () => {
            const out = (0, execShellCommand_1.default)({ cmd: `git tag --list "${this.sourceRef}"` });
            return !!out.length;
        };
        if (sourceRef === MergeBranches.LAST_TAG) {
            this.sourceRef = this._getTag();
        }
        else {
            this.sourceRef = sourceRef;
        }
        this.isTag = this._isTagRef();
    }
    /**
     * Run command.
     *
     * @throws {ShellCommandExecutionError}
     */
    run() {
        core.info(`Merging '${this.sourceRef}' into '${this.targetRef}'`);
        this._checkout(this.targetRef);
        this._mergeBranches(this.sourceRef, this.targetRef, this.isTag);
        this._pushTargetBranch(this.targetRef, this.force);
    }
    _getTag() {
        const cmd = 'git describe --abbrev=0 --tags';
        const errorMessage = 'Cannot read last tag.';
        return (0, execShellCommand_1.default)({ cmd, errorMessage });
    }
}
MergeBranches.LAST_TAG = 'LAST_TAG';
__decorate([
    (0, decorators_1.logGroup)('Merge branches')
], MergeBranches.prototype, "run", null);
exports.default = MergeBranches;
