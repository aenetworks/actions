import * as core from '@actions/core';

import { logGroup } from '../decorators';
import { Command } from '../seedWorks';

export default class CreateDraftRelease implements Command {
  /**
   * Run command.
   */
  @logGroup('Create draft release')
  public run(): void {
    core.warning('Not implemented yet.');
  }
}
