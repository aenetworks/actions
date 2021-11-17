import ReleaseType from '../releaseType';
import { Command } from '../seedWorks';
import VersionBase from './version-base';
import VersionVo from './version-vo';

/**
 * Describe changes based on Conventional Commits.
 */
export default class LatestVersion extends VersionBase implements Command {
  constructor() {
    super(ReleaseType.PROD);
  }

  /**
   * Run command.
   */
  public run(): VersionVo | null {
    return this._getLatestVersion();
  }
}
