import * as core from '@actions/core';

import { CloneRepository } from './lib/git';
import Inputs from './lib/inputs';
import ReleaseType from './lib/releaseType';
import { DescribeChanges } from './lib/version';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const ref = inputs.getRef();

    new CloneRepository(repository, githubToken, ref).run();
    new DescribeChanges(ReleaseType.PROD).previewChangelog();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error);
  }
}

run();
