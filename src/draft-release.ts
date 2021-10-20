import * as core from '@actions/core';

import { CloneRepository, PushTags, SetupGitUser } from './lib/git';
import Inputs from './lib/inputs';
import { SetupNpmRegistry } from './lib/node';
import ReleaseType from './lib/releaseType';
import { BumpVersion, CreateDraftRelease, DescribeChanges } from './lib/version';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const ref = inputs.getRef();
    const botUsername = inputs.getBotUsername();
    const botEmail = inputs.getBotEmail();
    const npmAuthToken = inputs.getNpmAuthToken();
    const releaseType = inputs.getReleaseType();
    const skipCommit = inputs.getSkipCommit();
    const isPrerelease = releaseType !== ReleaseType.PROD;

    new CloneRepository(repository, githubToken, ref).run();
    new SetupGitUser(botUsername, botEmail).run();
    new SetupNpmRegistry(npmAuthToken).run();

    const changelog = new DescribeChanges(releaseType).run();
    const version = new BumpVersion(releaseType, skipCommit).run();

    new PushTags(ref).run();
    await new CreateDraftRelease(githubToken, version, isPrerelease, changelog).run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();
