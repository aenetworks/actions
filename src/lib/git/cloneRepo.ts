import * as core from '@actions/core';

import execShellCommand from '../execShellCommand';

interface ExecCloneProps {
  readonly repository: string;
  readonly token: string;
}

interface ExecSwitchBranchProps {
  readonly ref: string;
}
type CloneProps = ExecCloneProps & ExecSwitchBranchProps;

/**
 * Clone repository and switch to given ref.
 *
 * @param {string} repository - Repository name.
 * @param {string} token - GitHub token.
 * @param {string} ref - Git ref name (branch, tag).
 * @throws {ShellCommandExecutionError}
 */
const cloneRepo = ({ repository, token, ref }: CloneProps): void => {
  core.startGroup('Clone repository');
  _cloneRepository({ repository, token });
  _switchBranchToRef({ ref });
  core.endGroup();
};

const _cloneRepository = ({ repository, token }: ExecCloneProps): void => {
  const cmd = `git clone https://bot:${token}@github.com/${repository}.git .`;
  const errorMessage = `Cannot clone repository '${repository}'`;

  execShellCommand({ cmd, errorMessage });
};

const _switchBranchToRef = ({ ref }: ExecSwitchBranchProps): void => {
  const cmd = `git switch -c ${ref}`;
  const errorMessage = `Cannot switch to branch '${ref}'`;

  execShellCommand({ cmd, errorMessage });
};

export default cloneRepo;
