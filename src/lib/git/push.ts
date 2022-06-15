import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

export default class Push implements Command {
  private readonly timeout: number;

  constructor(private readonly onlyTags: boolean = false) {
    this.timeout = 30_000;
  }

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
      timeout: this.timeout,
    });
  };

  private _pushWithTags = (): void => {
    const cmd = 'git push --no-verify';

    execShellCommand({
      cmd,
      timeout: this.timeout,
    });

    this._pushTagsOnly();
  };
}
