import * as core from '@actions/core';
import * as shell from 'shelljs';

import { ErrorBase } from './seedWorks';

/**
 * Error while executing shell command.
 */
export class ShellCommandExecutionError extends ErrorBase {}

interface ExecShellCommandProps {
  readonly cmd: string;
  readonly errorMessage?: string;
  readonly useStdout?: boolean;
}

/**
 * Execute shell command.
 *
 * @param {string} cmd - Command to execute.
 * @param {string} [errorMessage=''] - Error message used to throw error.
 * @return {string} - Command output.
 * @throws {ShellCommandExecutionError} - Command execution error.
 */
const execShellCommand = ({ cmd, errorMessage = '', useStdout = false }: ExecShellCommandProps): string => {
  core.debug(`Running command: \`${cmd}\``);

  const res = shell.exec(cmd, { fatal: true });

  if (res.code) {
    const errorDescription = useStdout ? res.stdout : res.stderr;

    throw new ShellCommandExecutionError(`${errorMessage}\n${errorDescription}`);
  }

  return res.stdout;
};

export default execShellCommand;
