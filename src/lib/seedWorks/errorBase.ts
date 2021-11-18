export default abstract class ErrorBase<T = any> extends Error {
  public message: string = '';

  constructor(args?: T) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;

    if (args) {
      this.message = [this.message, args].filter((s) => !!(s as string).length).join(' ');
    }
  }
}
