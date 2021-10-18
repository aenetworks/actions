import * as core from '@actions/core';

import { SetupGitUser } from '../lib/git';

async function run() {
  try {
    const name = core.getInput('botUsername');
    const email = core.getInput('botEmail');

    new SetupGitUser(name, email);
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
