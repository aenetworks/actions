import ReleaseType from '../releaseType';
import { Command } from '../seedWorks';
import Version from './version';
import VersionBase from './version-base';

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
  public run(): Version {
    return this._getLatestVersion();
  }
}
