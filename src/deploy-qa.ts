import * as core from '@actions/core';

import { CloneRepository, MergeBranches } from './lib/git';
import Inputs from './lib/inputs';
import ReleaseType from './lib/releaseType';
import { DescribeChanges } from './lib/version';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const sourceRef = inputs.getSourceRef();
    const targetRef = inputs.getTargetRef();
    const force = inputs.getForce();

    new CloneRepository(repository, githubToken, targetRef).run();
    new MergeBranches(targetRef, sourceRef, force).run();

    new DescribeChanges(ReleaseType.PROD).previewChangelog();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
