export default abstract class ErrorBase<T = unknown> extends Error {
  public message = '';

  constructor(args?: T) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;

    if (args) {
      this.message = [this.message, args].filter((s) => !!(s as string).length).join(' ');
    }
  }
}
