import * as core from '@actions/core';

import * as colors from './lib/colors';
import { SearchDockerImagesRepository } from './lib/docker';
import { CloneRepository } from './lib/git';
import Inputs from './lib/inputs';
import { InstallDependencies, SetupNpmRegistry } from './lib/node';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const ref = inputs.getRef();
    const npmAuthToken = inputs.getNpmAuthToken();

    new CloneRepository(repository, githubToken, ref).run();

    new SetupNpmRegistry(npmAuthToken).run();
    new InstallDependencies().run();
    new SearchDockerImagesRepository().run();

    core.info(`${colors.green}Success${colors.reset}`);
  } catch (error) {
    core.setFailed(error as Error);
  }
}

run();
