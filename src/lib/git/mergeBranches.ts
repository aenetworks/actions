import * as core from '@actions/core';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

export default class MergeBranches implements Command {
  private readonly sourceRef: string;
  private readonly isTag: boolean;
  public static readonly LAST_TAG = 'LAST_TAG';

  /**
   * Construct MergeBranches command.
   *
   * @param {string} targetRef - Branch which will be updated.
   * @param {string|MergeBranches.LAST_TAG} sourceRef - Branch, tag or `MergeBranches.LAST_TAG`. Describes which code will be merged into
   *  targetRef. If set to 'MergeBranches.LAST_TAG' - last tag will be detected.
   * @param {boolean} force - Flag to force push.
   */
  constructor(private readonly targetRef: string, sourceRef: string, private readonly force: boolean = false) {
    if (sourceRef === MergeBranches.LAST_TAG) {
      this.sourceRef = this._getTag();
    } else {
      this.sourceRef = sourceRef;
    }

    this.isTag = this._isTagRef();
  }

  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  @logGroup('Merge branches')
  public run(): void {
    core.info(`Merging '${this.sourceRef}' into '${this.targetRef}'`);
    this._checkout(this.targetRef);
    this._mergeBranches(this.sourceRef, this.targetRef, this.isTag);
    this._pushTargetBranch(this.targetRef, this.force);
  }

  private _getTag(): string {
    const cmd = 'git describe --abbrev=0 --tags';
    const errorMessage = 'Cannot read last tag.';

    return execShellCommand({ cmd, errorMessage });
  }

  private _checkout = (targetRef: string): void => {
    const cmd = `git checkout ${targetRef}`;
    const errorMessage = `Cannot checkout to '${targetRef}'`;

    execShellCommand({ cmd, errorMessage });
  };

  private _mergeBranches = (sourceRef: string, targetRef: string, isTag: boolean): void => {
    const source = isTag ? sourceRef : 'origin/' + sourceRef;

    const cmd = `git merge --ff-only ${source}`;
    const errorMessage = `Cannot merge '${sourceRef}' into '${targetRef}'`;

    execShellCommand({ cmd, errorMessage });
  };

  private _pushTargetBranch = (targetRef: string, isForce: boolean): void => {
    const cmd = `git push --set-upstream origin ${targetRef}${isForce ? ' --force' : ''}`;
    const errorMessage = `Cannot push '${targetRef}'`;

    execShellCommand({ cmd, errorMessage });
  };

  private _isTagRef = () => {
    const out = execShellCommand({ cmd: `git tag --list | grep ${this.sourceRef}` });

    return !!out.length;
  };
}
