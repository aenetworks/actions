import * as core from '@actions/core';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

export default class SetupGitUser implements Command {
  /**
   * Create SetupGitUser command.
   *
   * @param {string} name - User name.
   * @param {string} email - User email.
   */
  constructor(private readonly name: string, private readonly email: string) {}

  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  @logGroup('Setup bot user')
  public run(): void {
    core.info(`Setup git user ${this.name}`);
    this._setGitUserName(this.name);
    this._setGitUserEmail(this.email);
  }

  private _setGitUserName = (name: string): void => {
    core.debug(`Name: ${name}`);

    const cmd = `git config user.name "${name}"`;
    const errorMessage = `Cannot set git user.name=${name}`;

    execShellCommand({
      cmd,
      errorMessage,
    });
  };

  private _setGitUserEmail = (email: string): void => {
    core.debug(`Email: ${email}`);

    const cmd = `git config user.email "<${email}>"`;
    const errorMessage = `Cannot set git user.email=${email}`;

    execShellCommand({ cmd, errorMessage });
  };
}
