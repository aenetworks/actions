import * as core from '@actions/core';
import * as github from '@actions/github';

import { logGroup } from './decorators';
import { Command } from './seedWorks';

/**
 * Cancel run of workflow.
 */
export default class CancelRun implements Command {
  constructor(private readonly reason: string = '') {}

  /**
   * Run command.
   */
  @logGroup('Cancel run')
  public run(): void {
    if (this.reason) {
      core.warning(`Canceling run. Reason: "${this.reason}"`);
    } else {
      core.warning('Canceling run');
    }

    console.log(github.context.workflow);
    console.log(github.context.runId);
    console.log(github.context.runNumber);
  }
}
