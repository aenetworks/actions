import * as core from '@actions/core';
import * as shell from 'shelljs';

import * as colors from './colors';
import { ErrorBase } from './seedWorks';

/**
 * Error while executing shell command.
 */
export class ShellCommandExecutionError extends ErrorBase {}

interface ExecShellCommandProps {
  readonly cmd: string;
  readonly errorMessage?: string;
  readonly useStdout?: boolean;
  readonly silent?: boolean;
}

/**
 * Execute shell command.
 *
 * @param {string} cmd - Command to execute.
 * @param {string} [errorMessage=''] - Error message used to throw error.
 * @param {boolean} [useStdout=false] - Should use Stdout instead Stderr to describe error details.
 * @param {boolean} [silent=false] - Should echo to console.
 * @return {string} - Command output.
 * @throws {ShellCommandExecutionError} - Command execution error.
 */
const execShellCommand = ({
  cmd,
  errorMessage = '',
  useStdout = false,
  silent = false,
}: ExecShellCommandProps): string => {
  core.info(`${colors.grey}$ ${cmd}${colors.reset}`);

  const res = shell.exec(cmd, { silent: true });

  if (!silent) {
    res.stdout.split('\n').forEach((line) => {
      core.info(`${colors.blue}${res.stdout}${colors.reset}`);
    });
  }

  if (res.code !== 0) {
    const message = errorMessage ? errorMessage.trim() + '\n' : '';
    const description = useStdout ? res.stdout.trim() : res.stderr.trim();

    throw new ShellCommandExecutionError(`${message}${description}`);
  }

  return res.stdout;
};

export default execShellCommand;
