"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
            const output = (0, execShellCommand_1.default)({ cmd, errorMessage, silent: true });
            return output.trim();
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
        return changelogLines.slice(2, changelogLines.length - 3).join('\n');
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
