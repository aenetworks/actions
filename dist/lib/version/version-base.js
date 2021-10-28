"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const execShellCommand_1 = __importDefault(require("../execShellCommand"));
const releaseType_1 = __importDefault(require("../releaseType"));
class Version {
    constructor(major = 0, minor = 0, patch = 0, original = '') {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.original = original;
    }
    static parse(versionString) {
        const match = versionString.match(Version.validVersionRegex);
        if (!match) {
            // todo error
            throw new Error('invalid version');
        }
        const { major, minor, patch } = match.groups;
        return new Version(Number(major), Number(minor), Number(patch), versionString);
    }
    static isValidVersion(versionString) {
        return Version.validVersionRegex.test(versionString);
    }
    static sortAsc(first, second) {
        const comparedMajor = first.major - second.major;
        if (comparedMajor !== 0) {
            return comparedMajor;
        }
        const comparedMinor = first.minor - second.minor;
        if (comparedMinor !== 0) {
            return comparedMinor;
        }
        return first.patch - second.patch;
    }
    static sortDesc(first, second) {
        return -1 * this.sortAsc(first, second);
    }
    asString() {
        if (this.original) {
            return this.original;
        }
        return `v${this.major}.${this.minor}.${this.patch}`;
    }
}
Version.validVersionRegex = /v(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d*)/;
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
        this._getLatestTag = () => {
            const cmd = 'git tag -l';
            const errorMessage = 'Cannot get current version';
            const tagsList = (0, execShellCommand_1.default)({ cmd, errorMessage, silent: true });
            const tags = tagsList
                .split('\n')
                .filter((tag) => Version.isValidVersion(tag))
                .map((tag) => Version.parse(tag))
                .sort(Version.sortAsc);
            console.log(tags);
            return tags[0].asString();
            // return output.trim();
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
        return changelog.replace(/^#{1,3}/, '##');
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
