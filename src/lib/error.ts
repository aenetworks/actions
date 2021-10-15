abstract class ErrorFactory<T = any> extends Error {
  constructor(args?: T) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.message = this.constructor['msg'];
  }
}

export class ShellCommandExecutionError extends ErrorFactory {}
