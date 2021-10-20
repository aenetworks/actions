import * as core from '@actions/core';
import fs from 'fs';
import path from 'path';

import execShellCommand from '../execShellCommand';
import ReleaseType from '../releaseType';

export default class VersionBase {
  /**
   * Constructs VersionBase.
   *
   * @param {ReleaseType} releaseType - Release type.
   */
  constructor(private readonly releaseType: ReleaseType) {}

  protected _getCurrentVersion = (): string => {
    const cmd = 'git describe --abbrev=0 --tags | cut -c2-';
    const errorMessage = 'Cannot get current version';

    return execShellCommand({ cmd, errorMessage, silent: true });
  };

  protected _ensureRightVersionIsDescribed(currentVersion: string): void {
    const filePath = path.join(process.cwd(), 'package.json');
    const packageJson = require(filePath);

    packageJson.version = currentVersion;
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
  }

  protected _getChangelogEntry(): string {
    const cmd = `npx standard-version --dry-run --silent ${this._getReleaseTypeParam()}`;

    const rawChangelog = execShellCommand({ cmd, silent: true });
    const changelogLines = rawChangelog.split('\n');
    const changelog = changelogLines.slice(2, changelogLines.length - 3).join('\n');

    core.notice(changelog);

    return changelog;
  }

  protected _getReleaseTypeParam(): string {
    if (this.releaseType !== ReleaseType.PROD) {
      return `-p ${this.releaseType}`;
    }

    return '';
  }

  protected _bumpVersion(skipCommit: boolean = false): void {
    const skipCommitParam = skipCommit ? '--skip.commit' : '';

    const cmd = `npx standard-version --silent --skip.changelog ${skipCommitParam} ${this._getReleaseTypeParam()}`;

    execShellCommand({ cmd, silent: true });
  }
}
