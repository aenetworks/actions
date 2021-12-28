import * as core from '@actions/core';

import Inputs from '../lib/inputs';
import { RunNpmScript } from '../lib/node';

async function run() {
  try {
    const inputs = new Inputs();
    const script = inputs.getScriptName();

    new RunNpmScript(script).run();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
