import { ErrorBase } from '../seedWorks';

export class EslintChecksFailed extends ErrorBase {}

export class FailedEslintChecksHandler {
  private readonly re = /(.*?)\d+ problems \((.*?)\)\n/gm;

  public handle(error: Error): Error | false {
    const msg = error.message;
    const reports = Array.from(msg.matchAll(this.re));
    const header = reports.length > 1 ? 'Some checks did not pass\n\n' : '';
    const result = header + reports.map((match) => match[0].trim().replace('✖ ', '')).join('\n');

    if (result) {
      return new EslintChecksFailed(result);
    }

    return false;
  }
}

export default new FailedEslintChecksHandler();
