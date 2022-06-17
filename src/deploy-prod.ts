import * as core from '@actions/core';

import * as colors from './lib/colors';
import { CloneRepository, MergeBranches, SetupGitUser } from './lib/git';
import Inputs from './lib/inputs';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const botUsername = inputs.getBotUsername();
    const botEmail = inputs.getBotEmail();
    const targetRef = inputs.getTargetRef();
    const force = inputs.getForce();

    new CloneRepository(repository, githubToken, 'master').run();
    new SetupGitUser(botUsername, botEmail).run();
    new MergeBranches(targetRef, MergeBranches.LAST_TAG, force).run();
    core.info(`${colors.green}Success${colors.reset}`);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(error);
  }
}

run();
