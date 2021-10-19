import * as core from '@actions/core';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

const errorMessage = 'Error while publishing package.';

/**
 * Publish package to npm registry..
 *
 * Depending on prerelease flag it tag as next release..
 */
export default class Publish implements Command {
  /**
   * Constructs Publish command.
   *
   * @param {boolean} [isPrerelease=false] - Prerelease flag.
   */
  constructor(private readonly isPrerelease: boolean = false) {}

  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  @logGroup('Publish')
  public run(): void {
    if (this.isPrerelease) {
      this._publishPrerelease();
    } else {
      this._publishRelease();
    }
  }

  private _publishPrerelease() {
    core.info('Publishing prerelease.');

    const cmd = 'npm publish --tag next';

    execShellCommand({ cmd, errorMessage });
  }

  private _publishRelease() {
    core.info('Publishing release.');

    const cmd = 'npm publish';

    execShellCommand({ cmd, errorMessage });
  }
}
