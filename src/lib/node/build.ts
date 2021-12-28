import * as core from '@actions/core';
import * as path from 'path';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

const errorMessage = 'Error while run build script.';

/**
 * Build package.
 *
 * Skipped if script 'build' does not exists.
 */
export default class Build implements Command {
  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  @logGroup('Build')
  public run(): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { scripts } = require(path.join(process.cwd(), 'package.json'));

    if (Object.keys(scripts).includes('build')) {
      this._runBuild();
    } else {
      this._skipBuild();
    }
  }

  private _runBuild() {
    core.info('Build.');

    const cmd = 'npm run build';

    execShellCommand({ cmd, errorMessage });
  }

  private _skipBuild() {
    core.info('No build script. Skipped.');
  }
}
