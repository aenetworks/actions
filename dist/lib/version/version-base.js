"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
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
        return -1 * Version.sortAsc(first, second);
    }
    asString() {
        if (this.original) {
            return this.original;
        }
        return `v${this.major}.${this.minor}.${this.patch}`;
    }
    asStringWithoutPrefix() {
        return this.asString().slice(1);
    }
}
exports.Version = Version;
Version.validVersionRegex = /v(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/;
class VersionBase {
    /**
     * Constructs VersionBase.
     *
     * @param {ReleaseType} releaseType - Release type.
     */
    constructor(releaseType) {
        this.releaseType = releaseType;
        this._getLatestVersion = () => {
            const cmd = 'git tag -l';
            const errorMessage = 'Cannot get current version';
            const tagsList = (0, execShellCommand_1.default)({ cmd, errorMessage, silent: true });
            const tags = tagsList
                .split('\n')
                .map((tag) => tag.trim())
                .filter((tag) => Version.isValidVersion(tag))
                .map((tag) => Version.parse(tag))
                .sort(Version.sortDesc);
            return tags[0];
        };
    }
    _ensureRightVersionIsDescribed(currentVersion) {
        const filePath = path_1.default.join(process.cwd(), 'package.json');
        if (!fs_1.default.existsSync(filePath)) {
            fs_1.default.writeFileSync(filePath, JSON.stringify({}, null, 2));
        }
        const packageJson = require(filePath);
        packageJson.version = currentVersion.asStringWithoutPrefix();
        fs_1.default.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
    }
    _getChangelogEntry(currentVersion) {
        const cmd = `npx standard-version --dry-run --silent ${this._getReleaseTypeParam()}`;
        const rawChangelog = (0, execShellCommand_1.default)({ cmd, silent: true });
        const changelogLines = rawChangelog.split('\n');
        const changelog = changelogLines
            .slice(2, changelogLines.length - 3)
            .join('\n')
            .replace(/\(\[#\d+]\(.*?\)\)/g, '')
            .replace(/^#{1,3}/, '##');
        // try {
        return changelog + this._getDependenciesSection(currentVersion.asString());
        // } catch (e) {
        //   return changelog;
        // }
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
    _getDependenciesSection(tag) {
        let key;
        const getVer = (v) => {
            return v.replace(/^\D+/, '');
        };
        const filePath = path_1.default.join(process.cwd(), 'package.json');
        const old = (0, execShellCommand_1.default)({ cmd: `git show ${tag}:./package.json` });
        const oldDeps = JSON.parse(old).dependencies;
        const newDeps = require(filePath).dependencies;
        const added = [];
        const upgraded = [];
        const deleted = [];
        for (key in newDeps) {
            if (key in oldDeps) {
                const vNew = getVer(newDeps[key]);
                const vOld = getVer(oldDeps[key]);
                if (vNew !== vOld) {
                    // @ts-ignore
                    upgraded.push(`* upgraded \`${key}\` to ${vNew}`);
                }
            }
            else if (!(key in oldDeps)) {
                // @ts-ignore
                added.push(`* added \`${key}\`@${getVer(newDeps[key])}`);
            }
        }
        for (key in oldDeps) {
            if (!(key in newDeps)) {
                // @ts-ignore
                deleted.push(`* deleted \`${key}\``);
            }
        }
        if (!added.length && !upgraded.length && !deleted.length) {
            return '';
        }
        let response = '';
        response += '\n\n\n### Dependencies\n';
        if (upgraded.length) {
            response += '\n' + upgraded.join('\n');
        }
        if (added.length) {
            response += '\n' + added.join('\n');
        }
        if (deleted.length) {
            response += '\n' + deleted.join('\n');
        }
        return response;
    }
}
exports.default = VersionBase;
