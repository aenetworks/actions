import * as core from '@actions/core';

import * as node from '../lib/node';

async function run() {
  try {
    const script = core.getInput('script');

    new node.RunScript(script).run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
