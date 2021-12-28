import * as core from '@actions/core';

import { InstallDependencies } from '../lib/node';

async function run() {
  try {
    new InstallDependencies().run();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
