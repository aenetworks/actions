import * as core from '@actions/core';

import { logGroup } from './decorators';
import { Command } from './seedWorks';

/**
 * Cancel run of workflow.
 */
export default class CancelRun implements Command {
  /**
   * Run command.
   */
  @logGroup('Cancel run')
  public run(): void {
    core.warning('Canceling run');
  }
}
