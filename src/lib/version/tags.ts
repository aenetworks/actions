import * as core from '@actions/core';

import { logGroup } from '../decorators';
import { Command } from '../seedWorks';
import VersionBase from './version-base';

/**
 * Describe changes based on Conventional Commits.
 */
export default class Tags extends VersionBase implements Command {
  /**
   * Run command.
   */
  @logGroup('Tags')
  public run(): void {
    const currentVersion = this._getLatestVersion();

    console.log(currentVersion);
  }
}
