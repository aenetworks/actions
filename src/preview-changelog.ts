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

    const changelog = new DescribeChanges(ReleaseType.PROD).run();
    const tempChangelog = changelog.replace(/compare\/(.*?)\.\.\.(.*?)\)/, 'compare/$1...master');

    core.notice(tempChangelog);
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
