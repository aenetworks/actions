import * as core from '@actions/core';

import * as node from '../lib/node';

async function run() {
  try {
    const token = core.getInput('npmAuthToken');

    node.setupRegistry({ token });
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
