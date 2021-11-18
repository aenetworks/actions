import * as core from '@actions/core';

import { logGroup } from '../decorators';
import ReleaseType from '../releaseType';
import { Command } from '../seedWorks';
import VersionBase from './version-base';

/**
 * Describe changes based on Conventional Commits.
 */
export default class DescribeChanges extends VersionBase implements Command {
  private readonly ref: string;

  /**
   * Constructs DescribeChanges command..
   *
   * @param {ReleaseType} releaseType - Release type.
   * @param {string} ref - Branch name or ref.
   */
  constructor(releaseType: ReleaseType, ref: string) {
    super(releaseType);

    if (ref.toUpperCase().startsWith('REFS/HEADS/')) {
      this.ref = ref.substring('refs/heads/'.length);
    } else {
      this.ref = ref;
    }
  }

  /**
   * Run command.
   */
  @logGroup('Describe changes')
  public run(raw: boolean = false): string {
    return this.getChangelog(raw);
  }

  @logGroup('Preview changelog')
  public previewChangelog(): void {
    const changelog = this.getChangelog(true);

    try {
      const tempChangelog = changelog.replace(/compare\/(.*?)\.\.\.(.*?)\)/, `compare/$1...${this.ref})`);

      core.notice(tempChangelog);
    } catch (e) {}
  }

  protected getChangelog(raw: boolean = false) {
    const currentVersion = this._getLatestVersion();

    if (currentVersion) {
      this._ensureRightVersionIsDescribed(currentVersion);
      this._ensureThereIsLatestPrefixedTag(currentVersion);
    }

    return this._getChangelogEntry(currentVersion, raw);
  }
}
