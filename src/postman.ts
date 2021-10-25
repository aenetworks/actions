import * as core from '@actions/core';

import { CloneRepository } from './lib/git';
import Inputs from './lib/inputs';
import Postman from './lib/postman';

async function run() {
  try {
    const inputs = new Inputs();

    const repository = inputs.getRepository();
    const githubToken = inputs.getGithubToken();
    const ref = inputs.getRef();
    const postmanApiKey = inputs.getPostmanApiKey();
    const postmanCollectionId = inputs.getPostmanCollectionId();
    const postmanEnvironmentId = inputs.getPostmanEnvironmentId();

    new CloneRepository(repository, githubToken, ref).run();
    new Postman(postmanApiKey, postmanCollectionId, postmanEnvironmentId).run();
  } catch (error) {
    // @ts-ignore
    core.setFailed(error.message);
  }
}

run();