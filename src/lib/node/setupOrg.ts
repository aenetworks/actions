import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const getNpmrcLocation = () => path.resolve(process.cwd(), '.npmrc');

interface NpmrcRegistry {
  readonly registry: string;
  readonly url: string;
  readonly scope: string;
}

const getRegistry = (): NpmrcRegistry => {
  const registry = '//npm.pkg.github.com/';
  const url = `https:${registry}`;
  const scope = '@' + github.context.repo.owner;
  return {
    registry,
    url,
    scope,
  };
};

const buildNpmrcFile = (registry: NpmrcRegistry, token: string) => {
  let npmrcContent = '';
  if (fs.existsSync(getNpmrcLocation())) {
    const currentNpmrc = fs.readFileSync(getNpmrcLocation(), 'utf8');
    currentNpmrc.split(os.EOL).forEach((line: string) => {
      if (!line.toLowerCase().startsWith('registry')) {
        npmrcContent += line + os.EOL;
      }
    });
  }
  npmrcContent += `${registry.scope}:registry=${registry.url}${os.EOL}`;
  npmrcContent += `${registry.registry}:_authToken=${token}`;
  return npmrcContent;
};

const writeNpmrcFile = (npmrcFileContent: string) => {
  fs.writeFileSync(getNpmrcLocation(), npmrcFileContent);
  core.exportVariable('NPM_CONFIG_USERCONFIG', getNpmrcLocation());
};

const setupRegistry = (token: string) => {
  core.startGroup('Setup private registry');
  const registry = getRegistry();
  console.debug(`Setting up registry: ${registry.url} with scope ${registry.scope}`);
  const npmrcFile = buildNpmrcFile(registry, token);
  writeNpmrcFile(npmrcFile);
  core.exportVariable('NODE_AUTH_TOKEN', token);
  core.endGroup();
};

export default setupRegistry;
