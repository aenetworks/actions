import * as core from '@actions/core';

import * as colors from './lib/colors';
import { CloneRepository, Push, SetupGitUser } from './lib/git';
import Inputs from './lib/inputs';
import { SetupNpmRegistry } from './lib/node';
import ReleaseType from './lib/releaseType';
import { BumpVersion } from './lib/version';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const ref = inputs.getRef();
    const botUsername = inputs.getBotUsername();
    const botEmail = inputs.getBotEmail();
    const npmAuthToken = inputs.getNpmAuthToken();

    new CloneRepository(repository, githubToken, ref).run();
    new SetupGitUser(botUsername, botEmail).run();
    new SetupNpmRegistry(npmAuthToken).run();

    new BumpVersion(ReleaseType.PROD).run();

    new Push().run();
    core.info(`${colors.green}Success${colors.reset}`);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(error);
  }
}

run();
