import * as core from '@actions/core';
import * as shell from 'shelljs';

import execShellCommand from '../execShellCommand';

interface SetGitUserNameProps {
  readonly name: string;
}
interface SetupGitUserEmailProps {
  readonly email: string;
}
type SetupGitUserProps = SetGitUserNameProps & SetupGitUserEmailProps;

/**
 * Set up git bot user.
 *
 * @param {string} name - Git user.name.
 * @param {email} email - Git user.email.
 * @throws {ShellCommandExecutionError}
 */
const setupGitUser = ({ name, email }: SetupGitUserProps): void => {
  core.startGroup('Setup bot');
  _setGitUserName({ name });
  _setGitUserEmail({ email });
  core.endGroup();
};

const _setGitUserName = ({ name }: SetGitUserNameProps): void => {
  console.debug(`Name: ${name}`);

  const cmd = `git config user.name "${name}"`;
  const errorMessage = `Cannot set git user.name=${name}`;

  execShellCommand({
    cmd,
    errorMessage,
  });
};

const _setGitUserEmail = ({ email }: SetupGitUserEmailProps): void => {
  console.debug(`Email: ${email}`);

  const cmd = `git config user.email "<${email}>"`;
  const errorMessage = `Cannot set git user.email=${email}`;

  execShellCommand({ cmd, errorMessage });
};

export default setupGitUser;
