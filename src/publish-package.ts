import * as core from '@actions/core';

import * as colors from './lib/colors';
import { CloneRepository } from './lib/git';
import Inputs from './lib/inputs';
import { Build, InstallDependencies, Publish, SetupNpmRegistry } from './lib/node';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const ref = inputs.getRef();
    const npmAuthToken = inputs.getNpmAuthToken();
    const isPrerelease = inputs.isPrerelease();

    new CloneRepository(repository, githubToken, ref).run();
    new SetupNpmRegistry(npmAuthToken).run();
    new InstallDependencies().run();
    new Build().run();
    new Publish(isPrerelease).run();

    core.info(`${colors.green}Success${colors.reset}`);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(error);
  }
}

run();
