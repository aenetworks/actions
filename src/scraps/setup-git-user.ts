import * as core from '@actions/core';

import { SetupGitUser } from '../lib/git';
import Inputs from '../lib/inputs';

async function run() {
  try {
    const inputs = new Inputs();
    const botUsername = inputs.getBotUsername();
    const botEmail = inputs.getBotEmail();

    new SetupGitUser(botUsername, botEmail);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
