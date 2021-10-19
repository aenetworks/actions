import * as core from '@actions/core';
import * as path from 'path';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

/**
 * Run npm script command.
 *
 * Runs npm script if is defined in package.json file.
 */
export default class RunNpmScript implements Command {
  private readonly cmd: string;

  /**
   * Construct RunNpmScriptCommand.
   *
   * @param {string} script - Script name to run.
   * @param {boolean} [useStdout=false] - Should include Stdout as error description..
   */
  constructor(private readonly script: string, private readonly useStdout: boolean = false) {
    this.cmd = `npm run ${script}`;
  }

  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  // @logGroup('Run script')
  public run(): void {
    core.info(`Running npm script: '${this.script}'`);
    execShellCommand({ cmd: this.cmd, useStdout: this.useStdout });
  }

  public hasScript(): boolean {
    const { scripts } = require(path.join(process.cwd(), 'package.json'));

    return Object.keys(scripts).includes(this.script);
  }
}
