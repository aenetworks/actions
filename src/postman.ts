import * as core from '@actions/core';

import * as colors from './lib/colors';
import Inputs from './lib/inputs';
import Postman from './lib/postman';

async function run() {
  try {
    const inputs = new Inputs();
    const postman = inputs.getPostmanInputs();

    await new Postman(postman.apiKey, postman.collectionId, postman.environmentId).run();
    core.info(`${colors.green}Success${colors.reset}`);
  } catch (error) {
    // @ts-ignore
    core.setFailed(error);
  }
}

run();
