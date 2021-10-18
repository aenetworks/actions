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
    // const npmAuthToken = core.getInput('npmAuthToken');
    const npmAuthToken = process.env.NPM_AUTH_TOKEN || '';
    const script = core.getInput('script');
    const botUsername = core.getInput('botUsername');
    // const botEmail = core.getInput('botEmail');
    const botEmail = process.env.GITBOT_EMAIL || '';

    git.cloneRepo({ repository, token, ref });
    git.setupGitUser({ name: botUsername, email: botEmail });
    node.setupRegistry({ token: npmAuthToken });
    node.installDependencies();
    new node.RunScript(script).run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
