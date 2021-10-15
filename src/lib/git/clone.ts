import * as core from '@actions/core';
import * as shell from 'shelljs';

interface CloneProps {
  readonly repository: string;
  readonly token: string;
  readonly ref: string;
}

const cloneRepo = ({ repository, token, ref }: CloneProps) => {
  core.startGroup('Clone repository');
  const cloneCmd = `git clone https://bot:${token}@github.com/${repository}.git .`;
  const switchCmd = `git switch -c ${ref}`;
  shell.exec(cloneCmd, { fatal: true });
  shell.exec(switchCmd, { fatal: true });
  core.endGroup();
};

export default cloneRepo;
