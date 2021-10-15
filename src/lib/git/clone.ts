import * as core from '@actions/core';
import * as shell from 'shelljs';
import { CloneProps, ExecCloneProps, ExecSwitchBranchProps } from "./interfaces";

/**
 * Clone repository and switch to given ref.
 *
 * @param {string} repository - Repository name.
 * @param {string} token - GitHub token.
 * @param {string} ref - Git ref name (branch, tag).
 */
const cloneRepo = ({ repository, token, ref }: CloneProps): void => {
  core.startGroup('Clone repository');
  _cloneRepository({ repository, token });
  _switchBranchToRef({ref});
  core.endGroup();
};


const _cloneRepository = ({ repository, token}: ExecCloneProps): void => {
  const cmd = `git clone https://bot:${token}@github.com/${repository}.git .`;
  const res = shell.exec(cmd, { fatal: true });

  if (res.code) {
    throw new Error(`Cannot clone repository '${repository}':\n${res.stdout}`);
  }
}


const _switchBranchToRef = ({ ref }: ExecSwitchBranchProps): void => {
  const cmd = `git switch -c ${ref}`;
  const res = shell.exec(cmd, { fatal: true });

  if (res.code) {
    throw new Error(`Cannot switch to branch '${ref}':\n${res.stdout}`);
  }
}

export default cloneRepo;
