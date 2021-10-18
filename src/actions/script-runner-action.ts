import * as core from '@actions/core';
import * as github from '@actions/github';

import { CloneRepository, SetupGitUser } from '../lib/git';
import { InstallDependencies, RunNpmScript, SetupNpmRegistry } from '../lib/node';

async function run() {
  try {
    const context = github.context;
    const repository = `${context.repo.owner}/${context.repo.repo}`;
    const ref = core.getInput('ref');
    const token = core.getInput('token');
    const npmAuthToken = core.getInput('npmAuthToken');
    const script = core.getInput('script');
    const botUsername = core.getInput('botUsername');
    const botEmail = core.getInput('botEmail') || process.env.GITBOT_EMAIL || '';

    new CloneRepository(repository, token, ref).run();
    new SetupGitUser(botUsername, botEmail).run();
    new SetupNpmRegistry(npmAuthToken).run();
    new InstallDependencies().run();
    new RunNpmScript(script).run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
