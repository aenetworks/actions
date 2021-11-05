import * as core from '@actions/core';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

export default class CloneRepository implements Command {
  /**
   * Construct CloneRepository command.
   *
   * @param {string} repository - Repository name.
   * @param {string} token - GitHub token.
   * @param {string} ref - Git ref name (branch, tag).
   */
  constructor(private readonly repository: string, private readonly token: string, private readonly ref: string) {}

  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  @logGroup('Clone repository')
  public run(): void {
    core.info(`Cloning repository ${this.repository}`);
    this._cloneRepository(this.repository, this.token);
    this._fetchRepository(this.repository);
    this._switchBranchToRef(this.ref);
  }

  private _cloneRepository = (repository: string, token: string): void => {
    const cmd = `git clone https://bot:${token}@github.com/${repository}.git .`;
    const errorMessage = `Cannot clone repository '${repository}'`;

    execShellCommand({ cmd, errorMessage });
    execShellCommand({
      cmd: 'ls .git/refs/heads',
    });
  };

  private _fetchRepository = (repository: string): void => {
    core.info('fetching');

    const cmd = 'git fetch';
    const errorMessage = `Cannot fetch repository '${repository}'`;

    execShellCommand({ cmd, errorMessage });
    execShellCommand({
      cmd: 'ls .git/refs/heads',
    });
  };

  private _switchBranchToRef = (ref: string): void => {
    try {
      const cmd = `git checkout ${ref}`;

      execShellCommand({ cmd });
    } catch (e) {
      // @ts-ignore
      core.info(e.message || '');

      const cmd = `git switch -c ${ref}`;
      const errorMessage = `Cannot switch to branch '${ref}'`;

      execShellCommand({ cmd, errorMessage });
    }
  };
}
