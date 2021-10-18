import * as core from '@actions/core';

import { RunNpmScript } from '../lib/node';

async function run() {
  try {
    const script = core.getInput('script');

    new RunNpmScript(script).run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
