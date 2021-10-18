import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';

// const runScript = (script: string) => {
//   logGroup(`Run script ${script}`, () => {
//     const cmd = `npm run ${script}`;
//
//     execShellCommand({ cmd });
//   });
// };
//
// export default runScript;

export default class RunScript {
  private readonly script: string;
  private readonly cmd: string;

  constructor(script: string) {
    this.script = script;
    this.cmd = `npm run ${script}`;
  }

  @logGroup('Run script')
  public run() {
    execShellCommand({ cmd: this.cmd });
  }
}
