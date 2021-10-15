import * as core from '@actions/core';
import * as shell from 'shelljs';

import execShellCommand from '../execShellCommand';
import * as utils from './utils';

const errorMessage = 'Error while installing packages';

/**
 * Install JavaScript dependencies from package.json file.
 *
 * @throws {ShellCommandExecutionError}
 */
const installDependencies = () => {
  core.startGroup('Install dependencies');

  if (utils.shouldUseYarn()) {
    _yarnInstall();
  } else {
    _npmInstall();
  }

  core.endGroup();
};

const _yarnInstall = () => {
  console.debug('Using yarn');

  const cmd = 'yarn install --frozen-lockfile';

  execShellCommand({ cmd, errorMessage });
};

const _npmInstall = () => {
  console.debug('Using npm');

  const cmd = 'npm ci';

  execShellCommand({ cmd, errorMessage });
};

export default installDependencies;
