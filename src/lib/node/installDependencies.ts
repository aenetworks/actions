import * as core from '@actions/core';
import * as shell from 'shelljs';

import * as utils from './utils';

const installDependencies = () => {
  core.startGroup('Install dependencies');
  if (utils.shouldUseYarn()) {
    console.debug('Using yarn');
    shell.exec('yarn install --frozen-lockfile', { fatal: true });
  } else {
    console.debug('Using npm');
    shell.exec('npm ci', { fatal: true });
  }
};

export default installDependencies;
