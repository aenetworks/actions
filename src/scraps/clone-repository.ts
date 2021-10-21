import * as core from '@actions/core';

import { CloneRepository } from '../lib/git';
import Inputs from '../lib/inputs';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const token = inputs.getGithubToken();
    const ref = inputs.getRef();

    new CloneRepository(repository, token, ref).run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
