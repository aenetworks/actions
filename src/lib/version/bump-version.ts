import * as core from '@actions/core';

import { logGroup } from '../decorators';
import { Command } from '../seedWorks';

export default class BumpVersion implements Command {
  /**
   * Run command.
   */
  @logGroup('Bump version.')
  public run(): void {
    core.warning('Not implemented yet.');
  }
}
