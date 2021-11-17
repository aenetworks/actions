import * as core from '@actions/core';

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

    const preLintCommand = new RunNpmScript('prelint', true);
    const lintCommand = new RunNpmScript('lint', true);
    const postLintCommand = new RunNpmScript('postlint', true);

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
  } catch (error) {
    const failedEslintChecks = FailedEslintChecksHandler.handle(error as Error);

    const errorToReport = failedEslintChecks ? failedEslintChecks : error;

    // @ts-ignore
    core.setFailed(errorToReport);
  }
}

run();
