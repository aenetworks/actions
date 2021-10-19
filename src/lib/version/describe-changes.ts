import * as fs from 'fs';
import * as path from 'path';

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
  @logGroup('Describe changes')
  public run(): string {
    const currentVersion = this._getCurrentVersion();

    this._ensureRightVersionIsDescribed(currentVersion);

    return this._getChangelogEntry();
  }

  private _getCurrentVersion = (): string => {
    const cmd = 'git describe --abbrev=0 --tags | cut -c2-';
    const errorMessage = 'Cannot get current version';

    return execShellCommand({ cmd, errorMessage });
  };

  private _ensureRightVersionIsDescribed(currentVersion: string): void {
    const filePath = path.join(process.cwd(), 'package.json');
    const packageJson = require(filePath);

    packageJson.version = currentVersion;
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
  }

  private _getChangelogEntry(): string {
    const cmd = 'npx standard-version --dry-run --silent';

    const rawChangelog = execShellCommand({ cmd });
    const changelogLines = rawChangelog.split('\n');
    const changelog = changelogLines.slice(6, changelogLines.length - 4).join('\n');

    console.log(rawChangelog);
    console.log('------------------------');
    console.log(changelog);

    return changelog;
  }
}
