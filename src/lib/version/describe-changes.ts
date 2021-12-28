import * as core from '@actions/core';

import { logGroup } from '../decorators';
import ReleaseType from '../releaseType';
import { Command } from '../seedWorks';
import VersionBase from './version-base';
import VersionVo from './version-vo';

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
  public run(raw = false): string {
    const currentVersion = this._getLatestVersion();

    return this.getChangelog(raw, currentVersion);
  }

  @logGroup('Preview changelog')
  public previewChangelog(): void {
    const currentVersion = this._getLatestVersion();
    const changelog = this.getChangelog(true, currentVersion);

    try {
      const tempChangelog = changelog.replace(
        /compare\/(.*?)\.\.\.(.*?)\)/,
        `compare/${currentVersion?.original}...${this.ref})`
      );

      core.notice(tempChangelog);
    } catch (e) {
      // suppressed
    }
  }

  protected getChangelog(raw = false, currentVersion: VersionVo | null) {
    if (currentVersion) {
      this._ensureRightVersionIsDescribed(currentVersion);
      this._ensureThereIsLatestPrefixedTag(currentVersion);
    }

    return this._getChangelogEntry(currentVersion, raw);
  }
}
