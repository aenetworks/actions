import * as core from '@actions/core';

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
  } catch (error) {
    // @ts-ignore
    core.setFailed(error);
  }
}

run();
