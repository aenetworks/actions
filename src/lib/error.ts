abstract class ErrorFactory<T = any> extends Error {
  constructor(args?: T) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;

    this.message = `${this.name}: ${args ? ': ' + args : ''}.`;
  }
}

export class ShellCommandExecutionError extends ErrorFactory {}
export class NpmrcFileError extends ErrorFactory {}
