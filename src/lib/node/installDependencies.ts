import * as core from '@actions/core';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';
import * as utils from './utils';

const errorMessage = 'Error while installing packages';

/**
 * Install JavaScript dependencies from package.json file.
 *
 * It uses package-lock.json or yarn.lock depending on which file is in repository.
 * If both, yarn takes precedence over npm..
 */
export default class InstallNpmDependencies implements Command {
  private readonly timeout: number;

  constructor() {
    this.timeout = 600_000;
  }
  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  @logGroup('Install dependencies')
  public run(): void {
    core.info('Installing dependencies.');

    if (utils.shouldUseYarn()) {
      this._yarnInstall();
    } else {
      this._npmInstall();
    }

    if (utils.isLernaRepo()) {
      this._bootstrapLerna();
    }
  }

  private _yarnInstall = () => {
    core.info('Using yarn');

    const cmd = 'yarn install --frozen-lockfile';

    execShellCommand({ cmd, errorMessage, timeout: this.timeout });
  };

  private _npmInstall = () => {
    core.info('Using npm');

    const cmd = 'npm ci';

    execShellCommand({ cmd, errorMessage, timeout: this.timeout });
  };

  private _bootstrapLerna() {
    core.info('Bootstrapping lerna');

    const npmCmd = 'npx lerna bootstrap --hoist';
    const yarnCmd = 'npx lerna bootstrap';

    const cmd = utils.shouldUseYarn() ? yarnCmd : npmCmd;

    execShellCommand({ cmd, errorMessage, timeout: this.timeout });
  }
}
