import * as core from '@actions/core';
import * as github from '@actions/github';

import * as git from '../lib/git';

async function run() {
  try {
    const context = github.context;
    const repository = `${context.repo.owner}/${context.repo.repo}`;
    const ref = core.getInput('ref');
    const token = core.getInput('token');

    git.clone({ repository, token, ref });
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
