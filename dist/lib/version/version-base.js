"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const execShellCommand_1 = __importDefault(require("../execShellCommand"));
const releaseType_1 = __importDefault(require("../releaseType"));
const version_1 = __importDefault(require("./version"));
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
                .filter((tag) => version_1.default.isValidVersion(tag))
                .map((tag) => version_1.default.parse(tag))
                .sort(version_1.default.sortDesc);
            return tags[0];
        };
    }
    _ensureRightVersionIsDescribed(currentVersion) {
        const filePath = path_1.default.join(process.cwd(), 'package.json');
        if (!fs_1.default.existsSync(filePath)) {
            fs_1.default.writeFileSync(filePath, JSON.stringify({}, null, 2));
        }
        const packageJson = require(filePath);
        packageJson.version = currentVersion;
        fs_1.default.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
    }
    _getChangelogEntry(currentVersion, raw) {
        const cmd = `npx standard-version --dry-run --silent ${this._getReleaseTypeParam()}`;
        const rawChangelog = (0, execShellCommand_1.default)({ cmd, silent: true });
        const changelogLines = rawChangelog.split('\n');
        const changelog = changelogLines
            .slice(2, changelogLines.length - 3)
            .join('\n')
            .replace(/\(\[#\d+]\(.*?\)\)/g, '')
            .replace(/^#{1,3}/, '##');
        try {
            return changelog + this._getDependenciesSection(currentVersion.asString(), raw) + '\n';
        }
        catch (e) {
            return changelog + '\n';
        }
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
    _getDependenciesSection(tag, raw) {
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
        const removed = [];
        for (key in newDeps) {
            if (key in oldDeps) {
                const vNew = getVer(newDeps[key]);
                const vOld = getVer(oldDeps[key]);
                if (vNew !== vOld) {
                    // @ts-ignore
                    upgraded.push(`* bump \`${key}\` to ${vNew}`);
                }
            }
            else if (!(key in oldDeps)) {
                // @ts-ignore
                added.push(`* add \`${key}\`@${getVer(newDeps[key])}`);
            }
        }
        for (key in oldDeps) {
            if (!(key in newDeps)) {
                // @ts-ignore
                removed.push(`* remove \`${key}\``);
            }
        }
        if (!added.length && !upgraded.length && !removed.length) {
            return '';
        }
        let response = '';
        response += '\n\n\n### Dependencies\n\n';
        if (!raw) {
            response += '<details>\n';
            response += '<summary>';
        }
        let summary = [];
        let body = '';
        if (added.length) {
            // @ts-ignore
            summary.push(`add: ${added.length}`);
            body += '\n' + added.join('\n');
        }
        if (upgraded.length) {
            // @ts-ignore
            summary.push(`bump: ${upgraded.length}`);
            body += '\n' + upgraded.join('\n');
        }
        if (removed.length) {
            // @ts-ignore
            summary.push(`remove: ${removed.length}`);
            body += '\n' + removed.join('\n');
        }
        const sumText = summary.join(',');
        response += sumText.charAt(0).toUpperCase() + sumText.slice(1) + ' packages';
        if (!raw) {
            response += '</summary>';
        }
        response += '\n' + body;
        if (!raw) {
            response += '\n\n</details>';
        }
        return response;
    }
}
exports.default = VersionBase;
