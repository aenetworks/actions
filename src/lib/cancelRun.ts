import * as core from '@actions/core';
import * as github from '@actions/github';

import { logGroup } from './decorators';
import { Command } from './seedWorks';

/**
 * Cancel run of workflow.
 */
export default class CancelRun implements Command {
  constructor(private readonly token: string, private readonly reason: string = '') {}

  /**
   * Run command.
   */
  @logGroup('Cancel run')
  public async run(): Promise<void> {
    if (this.reason) {
      core.warning(`Canceling run. Reason: "${this.reason}"`);
    } else {
      core.warning('Canceling run');
    }

    const octokit = github.getOctokit(this.token);
    const res = await octokit.rest.actions.cancelWorkflowRun({
      ...github.context.repo,
      run_id: Number(github.context.runId),
    });

    console.log(res.status);
  }
}
