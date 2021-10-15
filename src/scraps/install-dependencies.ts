import * as core from '@actions/core';

import * as node from '../lib/node';

async function run() {
  try {
    node.installDependencies();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
