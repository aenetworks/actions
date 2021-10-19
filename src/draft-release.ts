import * as core from '@actions/core';

import { CloneRepository, SetupGitUser } from './lib/git';
import { DescribeChanges, BumpVersion, CreateDraftRelease} from "./lib/version";
import Inputs from './lib/inputs';
import { SetupNpmRegistry } from './lib/node';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const ref = inputs.getRef();
    const botUsername = inputs.getBotUsername();
    const botEmail = inputs.getBotEmail();
    const npmAuthToken = inputs.getNpmAuthToken();

    new CloneRepository(repository, githubToken, ref).run();
    new SetupGitUser(botUsername, botEmail).run();
    new SetupNpmRegistry(npmAuthToken).run();
    new DescribeChanges().run();
    new BumpVersion().run();
    new CreateDraftRelease().run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
