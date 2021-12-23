import * as core from '@actions/core';
import fs from 'fs';
import path from 'path';

import execShellCommand from '../execShellCommand';
import * as utils from '../node/utils';
import ReleaseType from '../releaseType';
import VersionVo from './version-vo';

export default class VersionBase {
  /**
   * Constructs VersionBase.
   *
   * @param {ReleaseType} releaseType - Release type.
   */
  constructor(private readonly releaseType: ReleaseType) {}

  protected _getLatestVersion = (): VersionVo | null => {
    const cmd = 'git tag -l';
    const errorMessage = 'Cannot get current version';

    const tagsList = execShellCommand({ cmd, errorMessage, silent: true });
    const tags = tagsList
      .split('\n')
      .map((tag) => tag.trim())
      .filter((tag) => VersionVo.isValidVersion(tag))
      .map((tag) => VersionVo.parse(tag))
      .filter((version) => (this.releaseType === ReleaseType.PROD ? !version.isPrerelease : true))
      .sort(VersionVo.sortDesc);

    if (!tags.length) {
      return null;
    }

    return tags[0];
  };

  protected _ensureRightVersionIsDescribed(currentVersion: VersionVo): void {
    const filePath = path.join(process.cwd(), 'package.json');

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }

    if (utils.isLernaRepo()) {
      execShellCommand({
        cmd: `npx lerna version --exact --no-push --no-git-tag-version -y ${currentVersion.asStringWithtPrefix()}`,
      });
    } else {
      execShellCommand({
        cmd: `npm version ${currentVersion.asStringWithtPrefix()} --no-git-tag-version --allow-same-version`,
      });
    }
  }

  protected _ensureThereIsLatestPrefixedTag(currentVersion: VersionVo): void {
    const tagExists = currentVersion.original === currentVersion.asStringWithtPrefix();

    if (!tagExists) {
      try {
        execShellCommand({ cmd: `git tag ${currentVersion.asStringWithtPrefix()} ${currentVersion.original}` });
      } catch (e) {
        core.info((e as Error).message);
      }
    }
  }

  protected _getChangelogEntry(currentVersion: VersionVo | null, raw: boolean): string {
    const cmd = [
      'npx standard-version',
      '--dry-run',
      '--silent',
      this._getFirstReleaseParam(!!currentVersion),
      this._getReleaseTypeParam(),
    ].join(' ');

    const rawChangelog = execShellCommand({ cmd, silent: true });

    const changelogLines = rawChangelog.split('\n');
    let changelog = changelogLines
      .slice(2, changelogLines.length - 3)
      .join('\n')
      .replace(/\(\[#\d+]\(.*?\)\)/g, '')
      .replace(/^#{1,3}/, '##');

    if (currentVersion) {
      try {
        changelog += this._getDependenciesSection(currentVersion.asString(), raw);
      } catch (e) {}
    }

    changelog += '\n';

    return changelog;
  }

  protected _getReleaseTypeParam(): string {
    if (this.releaseType !== ReleaseType.PROD) {
      return `-p ${this.releaseType}`;
    }

    return '';
  }

  protected _getFirstReleaseParam(hasCurrentVersion: boolean): string {
    if (!hasCurrentVersion) {
      return '--first-release';
    }

    return '';
  }

  protected _bumpVersion(): void {
    const cmd = `npx standard-version --silent --skip.changelog --skip.commit ${this._getReleaseTypeParam()}`;

    execShellCommand({ cmd, silent: true });
  }

  private _getDependenciesSection(tag: string, raw: boolean): string {
    let key;
    const getVer = (v) => {
      return v.replace(/^\D+/, '');
    };

    const filePath = path.join(process.cwd(), 'package.json');
    const old = execShellCommand({ cmd: `git show ${tag}:./package.json`, silent: true });

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
      } else if (!(key in oldDeps)) {
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
