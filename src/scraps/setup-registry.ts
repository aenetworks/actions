import * as core from '@actions/core';

import * as node from '../lib/node';

async function run() {
  try {
    const npmAuthToken = core.getInput('npmAuthToken');

    node.setupRegistry(npmAuthToken);
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
