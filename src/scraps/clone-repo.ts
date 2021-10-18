import * as core from '@actions/core';
import * as github from '@actions/github';

import { CloneRepository } from '../lib/git';

async function run() {
  try {
    const context = github.context;
    const repository = `${context.repo.owner}/${context.repo.repo}`;
    const ref = core.getInput('ref');
    const token = core.getInput('token');

    new CloneRepository(repository, token, ref).run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
