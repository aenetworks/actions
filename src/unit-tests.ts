import * as core from '@actions/core';

import * as colors from './lib/colors';
import { FailedJestTestsHandler } from './lib/errorHandlers';
import { CloneRepository } from './lib/git';
import Inputs from './lib/inputs';
import { InstallDependencies, RunNpmScript, SetupNpmRegistry } from './lib/node';

async function run() {
  let timeout;

  try {
    const inputs = new Inputs();
    const ms = inputs.getTimeout();

    console.log('MS: ' + ms);
    timeout = setTimeout(() => {
      core.setFailed('Timeout.');
    }, ms);

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const ref = inputs.getRef();
    const npmAuthToken = inputs.getNpmAuthToken();

    const preUnitTestsCommand = new RunNpmScript('pretest');
    const unitTestsCommand = new RunNpmScript('test');
    const postUnitTestsCommand = new RunNpmScript('posttest');

    new CloneRepository(repository, githubToken, ref).run();

    if (!unitTestsCommand.hasScript()) {
      core.notice('Unit tests job skipped, because script "test" does not exists in package.json');
    } else {
      new SetupNpmRegistry(npmAuthToken).run();
      new InstallDependencies().run();

      if (preUnitTestsCommand.hasScript()) {
        preUnitTestsCommand.run();
      }

      unitTestsCommand.run();

      if (postUnitTestsCommand.hasScript()) {
        postUnitTestsCommand.run();
      }
    }

    core.info(`${colors.green}Success${colors.reset}`);
  } catch (error) {
    const failedJestTests = FailedJestTestsHandler.handle(error as Error);

    const errorToReport = failedJestTests ? failedJestTests : error;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(errorToReport);
  } finally {
    clearTimeout(timeout)
  }
}

run();
