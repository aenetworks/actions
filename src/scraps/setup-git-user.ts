import * as core from '@actions/core';

import * as git from '../lib/git';

async function run() {
  try {
    const botUsername = core.getInput('botUsername');
    const botEmail = core.getInput('botEmail');

    git.setupGitUser(botUsername, botEmail);
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
