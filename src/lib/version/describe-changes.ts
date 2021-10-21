import * as core from '@actions/core';

import { logGroup } from '../decorators';
import { Command } from '../seedWorks';
import VersionBase from './version-base';

/**
 * Describe changes based on Conventional Commits.
 */
export default class DescribeChanges extends VersionBase implements Command {
  /**
   * Run command.
   */
  @logGroup('Describe changes')
  public run(): string {
    const currentVersion = this._getCurrentVersion();

    this._ensureRightVersionIsDescribed(currentVersion);

    return this._getChangelogEntry();
  }

  @logGroup('Preview changelog')
  public previewChangelog(): void {
    const changelog = this.run();
    const tempChangelog = changelog.replace(/compare\/(.*?)\.\.\.(.*?)\)/, 'compare/$1...master)');

    core.notice(tempChangelog);
  }
}
