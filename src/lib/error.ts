abstract class ErrorFactory<T = any> extends Error {
  private readonly _msg = '';

  constructor(args?: T) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this._msg = this.constructor['msg'];

    this.message = this.getMessage(args);
  }

  protected getMessage(args?: T): string {
    if (!!this._msg && !!args) {
      return `${this._msg}: ${args}.`;
    }

    if (!!this._msg) {
      return `${this._msg}.`;
    }

    if (!!args) {
      return `${args}.`;
    }

    return '';
  }
}

export class ShellCommandExecutionError extends ErrorFactory {}
