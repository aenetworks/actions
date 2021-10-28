import fs from 'fs';
import path from 'path';

import execShellCommand from '../execShellCommand';
import ReleaseType from '../releaseType';

class Version {
  static readonly validVersionRegex = /v(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d*)/;
  constructor(
    public readonly major: number = 0,
    public readonly minor: number = 0,
    public readonly patch: number = 0,
    public readonly original: string = ''
  ) {}

  static parse(versionString: string): Version {
    const match = versionString.match(Version.validVersionRegex);

    if (!match) {
      // todo error
      throw new Error('invalid version');
    }

    const { major, minor, patch } = match.groups as { major: string; minor: string; patch: string };

    return new Version(Number(major), Number(minor), Number(patch), versionString);
  }

  static isValidVersion(versionString: string): boolean {
    return Version.validVersionRegex.test(versionString);
  }

  static sortAsc(first: Version, second: Version): number {
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

  static sortDesc(first, second): number {
    return -1 * this.sortAsc(first, second);
  }

  asString(): string {
    if (this.original) {
      return this.original;
    }

    return `v${this.major}.${this.minor}.${this.patch}`;
  }
}

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
    const tags = tagsList
      .split('\n')
      .filter((tag) => Version.isValidVersion(tag))
      .map((tag) => Version.parse(tag))
      .sort(Version.sortAsc);

    console.log(tags);

    return tags[0].asString();

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
