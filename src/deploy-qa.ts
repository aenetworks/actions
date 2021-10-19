import * as core from '@actions/core';

import { CloneRepository, MergeBranches } from './lib/git';
import Inputs from './lib/inputs';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const sourceRef = inputs.getSourceRef();
    const targetRef = inputs.getTargetRef();
    const force = inputs.getForce();

    new CloneRepository(repository, githubToken, targetRef).run();
    console.log('clone finieshed');
    new MergeBranches(sourceRef, targetRef, force).run();
    console.log('merge');
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
