import * as core from '@actions/core';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { isLernaRepo } from '../node/utils';
import ReleaseType from '../releaseType';
import { Command } from '../seedWorks';
import VersionBase from './version-base';

export default class BumpVersion extends VersionBase implements Command {
  /**
   * Construct BumpVersion command.
   *
   * @param {ReleaseType} releaseType - Release type.
   * @param {boolean} [skipCommit=false] - Should skip release commit.
   */
  constructor(releaseType: ReleaseType, private readonly skipCommit: boolean = false) {
    super(releaseType);
  }

  /**
   * Run command.
   */
  @logGroup('Bump version')
  public run(): string {
    this._bumpVersion();

    const latestVersion = this._getLatestVersion();
    const version = latestVersion ? latestVersion.asStringWithtPrefix() : 'v0.0.0';

    execShellCommand({
      cmd: `git tag -d ${version} || true`,
    });

    if (!this.skipCommit) {
      execShellCommand({
        cmd: `git commit -am "chore(release): ${version}"`,
      });
    }

    if (latestVersion && isLernaRepo() && !this.skipCommit) {
      this._ensureRightVersionIsDescribed(latestVersion);

      execShellCommand({
        cmd: 'git commit -a --amend -n --no-edit',
      });
    }

    execShellCommand({
      cmd: `git tag ${version}`,
    });

    core.info(`New version: ${version}`);

    return version;
  }
}
