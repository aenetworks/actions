import * as core from '@actions/core';
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';

import ReleaseType, { ReleaseTypeError } from './releaseType';

export default class Inputs {
  context: Context;

  constructor() {
    this.context = github.context;
  }

  getRepository(): string {
    return `${this.context.repo.owner}/${this.context.repo.repo}`;
  }

  getRef(): string {
    return core.getInput('ref');
  }

  getSourceRef(): string {
    return core.getInput('sourceRef');
  }

  getTargetRef(): string {
    return core.getInput('targetRef');
  }

  getForce(): boolean {
    const value = core.getInput('force');

    if (value === 'true') {
      core.notice('"Force" set to true. It will override targetRef!');

      return true;
    } else if (value === 'false') {
      core.info('"Force" set to false.');

      return false;
    } else {
      core.warning(`"Force" has unrecognized value '${value}'. Set to false as fallback.`);

      return false;
    }
  }

  getGithubToken(): string {
    return core.getInput('token');
  }

  getNpmAuthToken(): string {
    return core.getInput('npmAuthToken') || process.env.NPM_AUTH_TOKEN || '';
  }

  getScriptName(): string {
    return core.getInput('script');
  }

  getBotUsername(): string {
    return core.getInput('botUsername') || process.env.BOT_NAME || '';
  }

  getBotEmail(): string {
    return core.getInput('botEmail') || process.env.BOT_EMAIL || '';
  }

  isPrerelease(): boolean {
    return core.getInput('isPrerelease') === 'true';
  }

  getSkipCommit(): boolean {
    return core.getInput('skipCommit') === 'true';
  }

  getReleaseType(): ReleaseType {
    const releaseType = core.getInput('releaseType');

    if (!releaseType || releaseType === ReleaseType.PROD) {
      return ReleaseType.PROD;
    } else if (releaseType === ReleaseType.BETA) {
      return ReleaseType.BETA;
    } else if (releaseType === ReleaseType.ALPHA) {
      return ReleaseType.ALPHA;
    } else if (releaseType === ReleaseType.RC) {
      return ReleaseType.RC;
    }

    throw new ReleaseTypeError(
      `Unknown release type ${releaseType}. Should be one of: "", "${ReleaseType.PROD}", "${ReleaseType.BETA}", "${ReleaseType.ALPHA}", "${ReleaseType.RC}"`
    );
  }
}
