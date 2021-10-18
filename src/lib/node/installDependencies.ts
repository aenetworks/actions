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
    if (utils.shouldUseYarn()) {
      this._yarnInstall();
    } else {
      this._npmInstall();
    }
  }

  private _yarnInstall = () => {
    core.debug('Using yarn');

    const cmd = 'yarn install --frozen-lockfile';

    execShellCommand({ cmd, errorMessage });
  };

  private _npmInstall = () => {
    core.debug('Using npm');

    const cmd = 'npm ci';

    execShellCommand({ cmd, errorMessage });
  };
}
