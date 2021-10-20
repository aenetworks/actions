import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

export default class PushTags implements Command {
  constructor(private readonly ref: string) {}

  /**
   * Run command.
   */
  @logGroup('Push tags')
  public run(): void {
    this._pushTags();
  }

  private _pushTags = (): void => {
    const cmd = `git push --follow-tags -set-upstream origin ${this.ref}`;

    execShellCommand({
      cmd,
    });
  };
}
