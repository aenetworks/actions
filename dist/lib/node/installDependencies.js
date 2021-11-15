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
const utils = __importStar(require("./utils"));
const errorMessage = 'Error while installing packages';
/**
 * Install JavaScript dependencies from package.json file.
 *
 * It uses package-lock.json or yarn.lock depending on which file is in repository.
 * If both, yarn takes precedence over npm..
 */
class InstallNpmDependencies {
    constructor() {
        this._yarnInstall = () => {
            core.info('Using yarn');
            const cmd = 'yarn install --frozen-lockfile';
            (0, execShellCommand_1.default)({ cmd, errorMessage });
        };
        this._npmInstall = () => {
            core.info('Using npm');
            const cmd = 'npm ci';
            (0, execShellCommand_1.default)({ cmd, errorMessage });
        };
    }
    /**
     * Run command.
     *
     * @throws {ShellCommandExecutionError}
     */
    run() {
        core.info('Installing dependencies.');
        if (utils.shouldUseYarn()) {
            this._yarnInstall();
        }
        else {
            this._npmInstall();
        }
        if (utils.isLernaRepo()) {
            this._bootstrapLerna();
        }
    }
    _bootstrapLerna() {
        core.info('Bootstrapping lerna');
        const cmd = 'npx lerna bootstrap';
        (0, execShellCommand_1.default)({ cmd, errorMessage });
    }
}
__decorate([
    (0, decorators_1.logGroup)('Install dependencies')
], InstallNpmDependencies.prototype, "run", null);
exports.default = InstallNpmDependencies;
