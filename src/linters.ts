import * as core from '@actions/core';

import * as colors from './lib/colors';
import { FailedEslintChecksHandler } from './lib/errorHandlers';
import { CloneRepository } from './lib/git';
import Inputs from './lib/inputs';
import { InstallDependencies, RunNpmScript, SetupNpmRegistry } from './lib/node';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const ref = inputs.getRef();
    const npmAuthToken = inputs.getNpmAuthToken();
    const timeout = inputs.getTimeout();

    const preLintCommand = new RunNpmScript('prelint', true, timeout);
    const lintCommand = new RunNpmScript('lint', true, timeout);
    const postLintCommand = new RunNpmScript('postlint', true, timeout);

    new CloneRepository(repository, githubToken, ref).run();

    if (!lintCommand.hasScript()) {
      core.notice('Linters job skipped, because script "lint" does not exists in package.json');
    } else {
      new SetupNpmRegistry(npmAuthToken).run();
      new InstallDependencies().run();

      if (preLintCommand.hasScript()) {
        preLintCommand.run();
      }

      lintCommand.run();

      if (postLintCommand.hasScript()) {
        postLintCommand.run();
      }
    }

    core.info(`${colors.green}Success${colors.reset}`);
  } catch (error) {
    console.log('on error');

    const failedEslintChecks = FailedEslintChecksHandler.handle(error as Error);

    const errorToReport = failedEslintChecks ? failedEslintChecks : error;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(errorToReport);
  }
}

run();
