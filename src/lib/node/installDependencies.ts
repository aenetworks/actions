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

    execShellCommand({ cmd, errorMessage });
  };

  private _npmInstall = () => {
    core.info('Using npm');

    const cmd = 'npm ci';

    execShellCommand({ cmd, errorMessage });
  };

  private _bootstrapLerna() {
    core.info('Bootstrapping lerna');

    const cmd = 'npx lerna bootstrap --hoist';

    execShellCommand({ cmd, errorMessage });
  }
}
