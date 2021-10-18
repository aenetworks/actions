import * as core from '@actions/core';

import { SetupNpmRegistry } from '../lib/node';

async function run() {
  try {
    const token = core.getInput('npmAuthToken');

    new SetupNpmRegistry(token).run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
