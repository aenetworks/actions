import * as core from '@actions/core';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';
import * as utils from './utils';

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
    if (utils.isLernaRepo()) {
      this._publishPrereleaseLerna();
    } else {
      this._publishPrereleaseRegular();
    }
  }

  private _publishPrereleaseRegular() {
    core.info('Publishing prerelease package.');

    const cmd = 'npm publish --tag next';

    execShellCommand({ cmd, errorMessage });
  }

  private _publishPrereleaseLerna() {
    core.info('Publishing lerna packages as prerelease.');

    const cmd = 'npx lerna exec -- npm publish --tag next';

    execShellCommand({ cmd, errorMessage });
  }

  private _publishRelease() {
    if (utils.isLernaRepo()) {
      this._publishReleaseLerna();
    } else {
      this._publishReleaseRegular();
    }
  }

  private _publishReleaseLerna() {
    core.info('Publishing lerna packages.');

    const cmd = 'npx lerna exec -- npm publish';

    execShellCommand({ cmd, errorMessage });
  }

  private _publishReleaseRegular() {
    core.info('Publishing package.');

    const cmd = 'npm publish';

    execShellCommand({ cmd, errorMessage });
  }
}
