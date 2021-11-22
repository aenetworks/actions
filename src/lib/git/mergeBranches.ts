import * as core from '@actions/core';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';
import { LatestVersion } from '../version';

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
      const latestVersion = new LatestVersion().run();

      this.sourceRef = latestVersion ? latestVersion.asString() : 'master';
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

    if (this.force) {
      this._checkout(this.sourceRef);
      // this._resetTargetBranch(this.sourceRef, this.targetRef, this.isTag);
      this._pushTargetBranch(this.targetRef, true);
    } else {
      this._checkout(this.targetRef);
      this._mergeBranches(this.sourceRef, this.targetRef);
      this._pushTargetBranch(this.targetRef, false);
    }
  }

  private _checkout = (targetRef: string): void => {
    const cmd = `git checkout -b ${targetRef} || git checkout ${targetRef}`;
    const errorMessage = `Cannot checkout to '${targetRef}'`;

    execShellCommand({ cmd, errorMessage });
  };

  private _mergeBranches = (sourceRef: string, targetRef: string): void => {
    const cmd = `git merge --ff-only origin/${sourceRef}`;
    const errorMessage = `Cannot merge '${sourceRef}' into '${targetRef}'`;

    execShellCommand({ cmd, errorMessage });
  };

  private _resetTargetBranch = (sourceRef: string, targetRef: string, isTag: boolean): void => {
    const source = isTag ? sourceRef : `origin/${sourceRef}`;
    const cmd = `git reset --hard ${source}`;

    execShellCommand({ cmd });
  };

  private _pushTargetBranch = (targetRef: string, isForce: boolean): void => {
    const cmd = `git push ${isForce ? ' --force' : ''} origin ${targetRef}`;
    const errorMessage = `Cannot push '${targetRef}'`;

    execShellCommand({ cmd, errorMessage });
  };

  private _isTagRef = (): boolean => {
    const out = execShellCommand({ cmd: `git tag --list "${this.sourceRef}"`, silent: true });

    return !!out.length;
  };
}
