import * as core from '@actions/core';
import * as shell from 'shelljs';

const setupGitUser = (name: string, email: string) => {
  core.startGroup('Setup bot user');
  console.debug(`Name: ${name}`);
  const configUserName = `git config user.name "${name}"`;
  shell.exec(configUserName);

  console.debug(`Email: ${email}`);
  const configUserEmail = `git config user.email "<${email}>"`;
  shell.exec(configUserEmail);
  core.endGroup();
};

export default setupGitUser;
