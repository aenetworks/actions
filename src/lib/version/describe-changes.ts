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
}
