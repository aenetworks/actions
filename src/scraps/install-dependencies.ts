import * as core from '@actions/core';

import { InstallDependencies } from '../lib/node';

async function run() {
  try {
    new InstallDependencies().run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
