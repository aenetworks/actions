import * as core from '@actions/core';

import * as colors from './lib/colors';
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
    new DescribeChanges(ReleaseType.PROD, targetRef).previewChangelog();
    core.info(`${colors.green}Success${colors.reset}`);
  } catch (error) {
    // @ts-ignore
    core.setFailed(error);
  }
}

run();
