import * as core from '@actions/core';

import CancelRun from './lib/cancelRun';
import { CloneRepository, SetupGitUser } from './lib/git';
import Inputs from './lib/inputs';
import { InstallDependencies, RunNpmScript, SetupNpmRegistry } from './lib/node';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const ref = inputs.getRef();
    const botUsername = inputs.getBotUsername();
    const botEmail = inputs.getBotEmail();
    const npmAuthToken = inputs.getNpmAuthToken();

    const unitTestsCommand = new RunNpmScript('test');

    new CloneRepository(repository, githubToken, ref).run();

    if (!unitTestsCommand.hasScript()) {
      core.notice('Unit tests job skipped, because script "test" does not exists in package.json');
    } else {
      new SetupGitUser(botUsername, botEmail).run();
      new SetupNpmRegistry(npmAuthToken).run();
      new InstallDependencies().run();
      unitTestsCommand.run();
    }
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
