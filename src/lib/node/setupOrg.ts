import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { NpmrcFileError } from '../error';

interface NpmrcRegistry {
  readonly registry: string;
  readonly url: string;
  readonly scope: string;
}

interface SetupRegistryProps {
  readonly token: string;
}

/**
 * Setup Npm registryl
 *
 * @param {string} token - Npm token.
 * @throws {NpmrcFileError}
 */
const setupRegistry = ({ token }: SetupRegistryProps): void => {
  core.startGroup('Setup private registry');

  const registry = _constructRegistry();
  const npmrcFile = new NpmrcFile(registry, token);

  console.debug(`Setting up registry: ${registry.url} with scope ${registry.scope}`);

  npmrcFile.save();

  core.exportVariable('NODE_AUTH_TOKEN', token);
  core.endGroup();
};

const _constructRegistry = (): NpmrcRegistry => {
  const registry = '//npm.pkg.github.com/';
  const url = `https:${registry}`;
  const scope = '@' + github.context.repo.owner;

  return {
    registry,
    url,
    scope,
  };
};

class NpmrcFile {
  private readonly content: string;

  /**
   * Construct Npmrc file.
   *
   * @param {NpmrcRegistry} registry - Registry data.
   * @param {string} token - Npm token.
   */
  constructor(registry: NpmrcRegistry, token: string) {
    this.content = this._getContent(registry, token);
  }

  private _getContent(registry: NpmrcRegistry, token: string): string {
    let content = '';

    if (fs.existsSync(this._getLocation())) {
      content = this._readCurrentNpmrcFile();
    }

    content += `${registry.scope}:registry=${registry.url}${os.EOL}`;
    content += `${registry.registry}:_authToken=${token}`;

    return content;
  }

  private _getLocation(): string {
    return path.resolve(process.cwd(), '.npmrc');
  }

  /**
   * Save current file to disk.
   *
   * @throws {NpmrcFileError}
   */
  public save(): void {
    try {
      fs.writeFileSync(this._getLocation(), this.content);
      core.exportVariable('NPM_CONFIG_USERCONFIG', this._getLocation());
    } catch (e) {
      // @ts-ignore
      throw new NpmrcFileError('Cannot save .npmrc file: ' + e.message);
    }
  }

  private _readCurrentNpmrcFile(): string {
    let content = '';
    const currentNpmrc = fs.readFileSync(this._getLocation(), 'utf8');

    currentNpmrc.split(os.EOL).forEach((line: string) => {
      if (!line.toLowerCase().startsWith('registry')) {
        content += line + os.EOL;
      }
    });

    return content;
  }
}

export default setupRegistry;
