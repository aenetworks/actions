import * as core from '@actions/core';

import Inputs from '../lib/inputs';
import { SetupNpmRegistry } from '../lib/node';

async function run() {
  try {
    const inputs = new Inputs();
    const npmAuthToken = inputs.getNpmAuthToken();

    new SetupNpmRegistry(npmAuthToken).run();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(error.message as string);
  }
}

run();
