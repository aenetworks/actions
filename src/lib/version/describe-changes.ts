import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

/**
 * Describe changes based on Conventional Commits.
 */
export default class DescribeChanges implements Command {
  /**
   * Constructs DescribeChanges command.
   *
   * @param {boolean} [saveToFile=false] - Should save to temporary file.
   */
  constructor(private readonly saveToFile: boolean = false) {}

  /**
   * Run command.
   */
  @logGroup('Describe changes.')
  public async run(): Promise<void> {
    const currentVersion = this._getCurrentVersion();

    await this._ensureRightVersionIsDescribed(currentVersion);
    // echo "$(npx standard-version --dry-run --silent | tail -n +3 | head -n -2)" > /tmp/changelog.txt
    // cat /tmp/changelog.txt
  }

  private _getCurrentVersion = (): string => {
    const cmd = 'git describe --abbrev=0 --tags | cut -c2-';
    const errorMessage = 'Cannot get current version';

    return execShellCommand({ cmd, errorMessage });
  };

  private async _ensureRightVersionIsDescribed(currentVersion: string): Promise<void> {
    const packageJson = require('./package.json');

    packageJson.version = currentVersion;
    console.log(packageJson);
  }
}
