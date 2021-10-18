export default abstract class ErrorBase<T = any> extends Error {
  constructor(args?: T) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.message = this.getMessage(args);
  }

  private getMessage(args?: T) {
    if (args) {
      return `${this.name}: ${args}`;
    }

    return this.name;
  }
}
