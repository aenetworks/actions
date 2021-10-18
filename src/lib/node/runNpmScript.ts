import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

/**
 * Run npm script command.
 *
 * Runs npm script if is defined in package.json file.
 */
export default class RunNpmScript implements Command {
  private readonly script: string;
  private readonly cmd: string;

  /**
   * Construct RunNpmScriptCommand
   * @param {string} script - Script name to run.
   */
  constructor(script: string) {
    this.script = script;
    this.cmd = `npm run --if-present ${script}`;
  }

  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  @logGroup('Run script')
  public run(): void {
    execShellCommand({ cmd: this.cmd });
  }
}
