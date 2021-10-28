import * as core from '@actions/core';

import ReleaseType from '../lib/releaseType';
import { Tags } from '../lib/version';

async function run() {
  try {
    new Tags(ReleaseType.PROD).run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error);
  }
}

run();
