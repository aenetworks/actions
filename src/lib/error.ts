abstract class ErrorFactory<T = any> extends Error {
  private readonly _msg = '';

  constructor(args?: T) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this._msg = this.constructor['msg'];

    this.message = `${this.name}: ${this._msg}${args ? ': ' + args : ''}.`;
  }
}

export class ShellCommandExecutionError extends ErrorFactory {}
