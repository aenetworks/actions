import * as core from '@actions/core';

import * as git from '../lib/git';

async function run() {
  try {
    const name = core.getInput('botUsername');
    const email = core.getInput('botEmail');

    git.setupGitUser({ name, email });
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
