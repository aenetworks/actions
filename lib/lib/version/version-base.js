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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const execShellCommand_1 = __importDefault(require("../execShellCommand"));
const releaseType_1 = __importDefault(require("../releaseType"));
class VersionBase {
    /**
     * Constructs VersionBase.
     *
     * @param {ReleaseType} releaseType - Release type.
     */
    constructor(releaseType) {
        this.releaseType = releaseType;
        this._getCurrentTag = () => {
            const cmd = 'git describe --abbrev=0 --tags';
            const errorMessage = 'Cannot get current version';
            return (0, execShellCommand_1.default)({ cmd, errorMessage, silent: true });
        };
        this._getCurrentVersion = () => {
            const tag = this._getCurrentTag();
            return tag.slice(1);
        };
    }
    _ensureRightVersionIsDescribed(currentVersion) {
        const filePath = path_1.default.join(process.cwd(), 'package.json');
        const packageJson = require(filePath);
        packageJson.version = currentVersion;
        fs_1.default.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
    }
    _getChangelogEntry() {
        const cmd = `npx standard-version --dry-run --silent ${this._getReleaseTypeParam()}`;
        const rawChangelog = (0, execShellCommand_1.default)({ cmd, silent: true });
        const changelogLines = rawChangelog.split('\n');
        const changelog = changelogLines.slice(2, changelogLines.length - 3).join('\n');
        core.notice(changelog);
        return changelog;
    }
    _getReleaseTypeParam() {
        if (this.releaseType !== releaseType_1.default.PROD) {
            return `-p ${this.releaseType}`;
        }
        return '';
    }
    _bumpVersion(skipCommit = false) {
        const skipCommitParam = skipCommit ? '--skip.commit' : '';
        const cmd = `npx standard-version --silent --skip.changelog ${skipCommitParam} ${this._getReleaseTypeParam()}`;
        (0, execShellCommand_1.default)({ cmd, silent: true });
    }
}
exports.default = VersionBase;
