import { ErrorBase } from '../seedWorks';

export class JestTestsFailed extends ErrorBase {}

export class FailedJestTestsHandler {
  private readonly re = /(.*?)Test Suites:(.*?)\n(.*?)Tests:(.*?)\n(.*?)Snapshots:(.*?)\n/gm;

  public handle(error: Error): Error | false {
    const msg = error.message;
    const reports = msg.matchAll(this.re);
    const result = Array.from(reports)
      .map((match) => match[0].trim())
      .join('\n\n');

    if (result) {
      return new JestTestsFailed(result);
    }

    return false;
  }
}

export default new FailedJestTestsHandler();
