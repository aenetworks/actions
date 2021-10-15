import * as core from '@actions/core';
import * as github from '@actions/github';

import * as git from '../lib/git';
import * as node from '../lib/node';

async function run() {
  try {
    const context = github.context;
    const repository = `${context.repo.owner}/${context.repo.repo}`;
    const ref = core.getInput('ref');
    const token = core.getInput('token');
    const npmAuthToken = core.getInput('npmAuthToken');
    const script = core.getInput('script');
    const botUsername = core.getInput('botUsername');
    const botEmail = core.getInput('botEmail');

    git.clone({ repository, token, ref });
    git.setupGitUser(botUsername, botEmail);
    node.setupRegistry(npmAuthToken);
    node.installDependencies();
    node.runScript(script);
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
