import * as core from '@actions/core';
import * as path from 'path';

import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

/**
 * Run npm script command.
 *
 * Runs npm script if is defined in package.json file.
 */
export default class RunNpmScript implements Command {
  private readonly cmd: string;
  private readonly timeout: number;

  /**
   * Construct RunNpmScriptCommand.
   *
   * @param {string} script - Script name to run.
   * @param {boolean} [useStdout=false] - Should include Stdout as error description.
   * @param {number} [timeout=3600000] - Execution timeout. One hour default.
   */
  constructor(private readonly script: string, private readonly useStdout: boolean = false, timeout = 3_600_000) {
    this.cmd = `npm run ${script}`;
    this.timeout = timeout;
  }

  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  run(): void {
    core.info(`Running: '${this.script}'`);
    execShellCommand({ cmd: this.cmd, useStdout: this.useStdout, timeout: this.timeout });
  }

  public hasScript(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { scripts } = require(path.join(process.cwd(), 'package.json'));

    return Object.keys(scripts).includes(this.script);
  }
}
