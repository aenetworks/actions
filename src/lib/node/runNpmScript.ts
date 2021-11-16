import * as core from '@actions/core';
import * as path from 'path';

import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';
import * as utils from './utils';

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
    this.cmd = utils.isLernaRepo() ? `npx lerna run ${script} --parallel --no-bail` : `npm run ${script}`;
  }

  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  public run(): void {
    core.info(`Running: '${this.cmd}'`);
    execShellCommand({ cmd: this.cmd, useStdout: this.useStdout });
  }

  public hasScript(): boolean {
    const { scripts } = require(path.join(process.cwd(), 'package.json'));

    return Object.keys(scripts).includes(this.script);
  }
}
