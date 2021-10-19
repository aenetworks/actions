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
const path = __importStar(require("path"));
const execShellCommand_1 = __importDefault(require("../execShellCommand"));
/**
 * Run npm script command.
 *
 * Runs npm script if is defined in package.json file.
 */
class RunNpmScript {
    /**
     * Construct RunNpmScriptCommand.
     *
     * @param {string} script - Script name to run.
     * @param {boolean} [useStdout=false] - Should include Stdout as error description..
     */
    constructor(script, useStdout = false) {
        this.script = script;
        this.useStdout = useStdout;
        this.cmd = `npm run ${script}`;
    }
    /**
     * Run command.
     *
     * @throws {ShellCommandExecutionError}
     */
    // @logGroup('Run script')
    run() {
        core.info(`Running npm script: '${this.script}'`);
        (0, execShellCommand_1.default)({ cmd: this.cmd, useStdout: this.useStdout });
    }
    hasScript() {
        const { scripts } = require(path.join(process.cwd(), 'package.json'));
        return Object.keys(scripts).includes(this.script);
    }
}
exports.default = RunNpmScript;
