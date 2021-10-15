import * as core from '@actions/core';
import * as shell from 'shelljs';

const runScript = (script: string) => {
  core.startGroup(`Run script: ${script}`);

  const result = shell.exec(`npm run ${script}`, { fatal: true });

  if (result.code > 0) {
    core.setFailed(result.stderr);
  }

  core.endGroup();
};

export default runScript;
