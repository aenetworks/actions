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
  public run(raw: boolean = false): string {
    const currentVersion = this._getLatestVersion();

    if (currentVersion) {
      this._ensureRightVersionIsDescribed(currentVersion);
      this._ensureThereIsLatestPrefixedTag(currentVersion);
    }

    return this._getChangelogEntry(currentVersion, raw);
  }

  @logGroup('Preview changelog')
  public previewChangelog(): void {
    const changelog = this.run(true);

    try {
      const tempChangelog = changelog.replace(/compare\/(.*?)\.\.\.(.*?)\)/, 'compare/$1...master)');

      core.notice(tempChangelog);
    } catch (e) {}
  }
}
