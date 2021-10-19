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
}

/**
 * Execute shell command.
 *
 * @param {string} cmd - Command to execute.
 * @param {string} [errorMessage=''] - Error message used to throw error.
 * @return {string} - Command output.
 * @throws {ShellCommandExecutionError} - Command execution error.
 */
const execShellCommand = ({ cmd, errorMessage = '' }: ExecShellCommandProps): string => {
  core.debug(`Running command: \`${cmd}\``);

  const res = shell.exec(cmd, { fatal: true });

  if (res.code) {
    throw new ShellCommandExecutionError(`${errorMessage}\n${res.stderr}`);
  }

  return res.stdout;
};

export default execShellCommand;
