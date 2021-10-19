import * as core from '@actions/core';

import CancelRun from './lib/cancelRun';
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

    const lintersCommand = new RunNpmScript('lint', true);

    new CloneRepository(repository, githubToken, ref).run();

    if (!lintersCommand.hasScript()) {
      await new CancelRun(githubToken, 'Script "lint" does not exists').run();
    } else {
      new SetupNpmRegistry(npmAuthToken).run();
      new InstallDependencies().run();
      lintersCommand.run();
    }
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
