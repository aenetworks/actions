import * as shell from 'shelljs';

import { ShellCommandExecutionError } from './error';

interface ExecShellCommandProps {
  readonly cmd: string;
  readonly errorMessage: string;
}

/**
 * Execute shell command.
 *
 * @param {string} cmd - Command to execute.
 * @param {string} errorMessage - Error message used to throw error.
 * @throws {Error} - Command execution error.
 */
const execShellCommand = ({ cmd, errorMessage }: ExecShellCommandProps): void => {
  const res = shell.exec(cmd, { fatal: true });

  if (res.code) {
    throw new ShellCommandExecutionError(`${errorMessage}:\n${res.stderr}`);
  }
};

export default execShellCommand;
