import * as core from '@actions/core';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import * as utils from '../node/utils';
import { Command } from '../seedWorks';
import { LatestVersion } from '../version';

export default class MergeBranches implements Command {
  private readonly sourceRef: string;
  private readonly isTag: boolean;
  private readonly timeout: number;
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
    this.timeout = 30_000;

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
      this._checkout(this.targetRef);
      this._resetTargetBranch(this.sourceRef, this.targetRef, this.isTag);

      if (this.isTag) {
        try {
          this._addVersionCommit(this.sourceRef);
        } catch (e) {
          // No package.json, it's ok to skip.
        }
      }

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

    execShellCommand({ cmd, errorMessage, timeout: this.timeout });
  };

  private _mergeBranches = (sourceRef: string, targetRef: string): void => {
    const cmd = `git merge --ff-only origin/${sourceRef}`;
    const errorMessage = `Cannot merge '${sourceRef}' into '${targetRef}'`;

    execShellCommand({
      cmd,
      errorMessage,

      timeout: this.timeout,
    });
  };

  private _resetTargetBranch = (sourceRef: string, targetRef: string, isTag: boolean): void => {
    const source = isTag ? sourceRef : `origin/${sourceRef}`;
    const cmd = `git reset --hard ${source}`;

    execShellCommand({ cmd, timeout: this.timeout });
  };

  private _addVersionCommit(sourceRef: string) {
    const versionCmd = utils.shouldUseYarn()
      ? `yarn version --new-version ${sourceRef} --no-git-tag-version`
      : `npm version ${sourceRef} --no-git-tag-version`;
    const commitCmd = `git commit -am 'release: ${sourceRef}'`;

    execShellCommand({ cmd: versionCmd, timeout: this.timeout });
    execShellCommand({ cmd: commitCmd, timeout: this.timeout });
  }

  private _pushTargetBranch = (targetRef: string, isForce: boolean): void => {
    const cmd = `git push --set-upstream origin ${targetRef} ${isForce ? ' --force' : ''}`;
    const errorMessage = `Cannot push '${targetRef}'`;

    execShellCommand({ cmd, errorMessage, timeout: this.timeout });
  };

  private _isTagRef = (): boolean => {
    const out = execShellCommand({ cmd: `git tag --list "${this.sourceRef}"`, silent: true, timeout: this.timeout });

    return !!out.length;
  };
}
