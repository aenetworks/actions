import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

export default class Push implements Command {
  constructor(private readonly onlyTags: boolean = false) {}

  /**
   * Run command.
   */
  @logGroup('Push tags')
  public run(): void {
    if (this.onlyTags) {
      this._pushTagsOnly();
    } else {
      this._pushWithTags();
    }
  }

  private _pushTagsOnly = (): void => {
    const cmd = 'git push --tags --no-verify';

    execShellCommand({
      cmd,
    });
  };

  private _pushWithTags = (): void => {
    const cmd = 'git push --no-verify';

    execShellCommand({
      cmd,
    });

    this._pushTagsOnly();
  };
}
