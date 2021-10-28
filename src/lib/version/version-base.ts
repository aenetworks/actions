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

  protected _getCurrentTag = (): string => {
    const cmd = 'git describe --abbrev=0 --tags';
    const errorMessage = 'Cannot get current version';

    const output = execShellCommand({ cmd, errorMessage, silent: true });

    return output.trim();
  };

  protected _getLatestTag = (): string => {
    const cmd = 'git tag -l';
    const errorMessage = 'Cannot get current version';

    const tagsList = execShellCommand({ cmd, errorMessage, silent: true });
    const tags = tagsList.split('\n');

    console.log(tags);

    return tags[0];

    // return output.trim();
  };

  protected _getCurrentVersion = (): string => {
    const tag = this._getCurrentTag();

    return tag.slice(1);
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

    return changelog.replace(/^#{1,3}/, '##');
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
