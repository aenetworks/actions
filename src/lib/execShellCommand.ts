import * as core from '@actions/core';
import * as ms from 'ms-typescript';
import * as shell from 'shelljs';

import * as colors from './colors';
import { ErrorBase } from './seedWorks';

/**
 * Error while executing shell command.
 */
export class ShellCommandExecutionError extends ErrorBase {}

export class Timeout extends ErrorBase {}

interface ExecShellCommandProps {
  readonly cmd: string;
  readonly errorMessage?: string;
  readonly useStdout?: boolean;
  readonly silent?: boolean;
  readonly timeout?: number;
}

/**
 * Execute shell command.
 *
 * @param {string} cmd - Command to execute.
 * @param {string} [errorMessage=''] - Error message used to throw error.
 * @param {boolean} [useStdout=false] - Should use Stdout instead Stderr to describe error details.
 * @param {boolean} [silent=false] - Should echo to console.
 * @param {number} [timeout] - Execution timout in milliseconds.
 * @return {string} - Command output.
 * @throws {ShellCommandExecutionError} - Command execution error.
 */
const execShellCommand = ({
  cmd,
  errorMessage = '',
  useStdout = false,
  silent = false,
  timeout,
}: ExecShellCommandProps): string => {
  core.info(`${colors.grey}$ ${cmd}${colors.reset}`);

  const start = new Date().getTime();
  const res = shell.exec(cmd, { silent, timeout });
  const end = new Date().getTime();
  const executionTime = end - start;

  core.info(`${colors.grey}-> ${ms.fromMs(executionTime)}${colors.reset}`);

  if (timeout && res.code === 1 && end - start > timeout) {
    throw new Timeout(`Command '${cmd}' reach execution timeout ${ms.fromMs(timeout)}.`);
  }

  if (res.code !== 0) {
    const message = errorMessage ? errorMessage.trim() + '\n' : '';
    const description = useStdout ? res.stdout.trim() : res.stderr.trim();

    throw new ShellCommandExecutionError(`${message}${description}`);
  }

  return res.stdout;
};

export default execShellCommand;
