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
const path = __importStar(require("path"));
const decorators_1 = require("../decorators");
const execShellCommand_1 = __importDefault(require("../execShellCommand"));
const errorMessage = 'Error while run build script.';
/**
 * Build package.
 *
 * Skipped if script 'build' does not exists.
 */
class Build {
    /**
     * Run command.
     *
     * @throws {ShellCommandExecutionError}
     */
    run() {
        const { scripts } = require(path.join(process.cwd(), 'package.json'));
        if (Object.keys(scripts).includes('build')) {
            this._runBuild();
        }
        else {
            this._skipBuild();
        }
    }
    _runBuild() {
        core.info('Build.');
        const cmd = 'npm run build';
        (0, execShellCommand_1.default)({ cmd, errorMessage });
    }
    _skipBuild() {
        core.info('No build script. Skipped.');
    }
}
__decorate([
    (0, decorators_1.logGroup)('Build')
], Build.prototype, "run", null);
exports.default = Build;
