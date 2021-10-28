import * as core from '@actions/core';

import { logGroup } from '../decorators';
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
    this._bumpVersion(this.skipCommit);

    const version = this._getLatestVersion().asString();

    core.info(`New version: ${version}`);

    return version;
  }
}
