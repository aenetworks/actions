import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { logGroup } from '../decorators';
import { Command, ErrorBase } from '../seedWorks';

/**
 * Error related to .npmrc file.
 */
export class NpmrcFileError extends ErrorBase {}

interface NpmrcRegistry {
  readonly registry: string;
  readonly url: string;
  readonly scope: string;
}

/**
 * Setup Npm registry command.
 *
 * Configure .npmrc file containing access to actual repository organization package
 * files.
 */
export default class SetupNpmRegistry implements Command {
  private readonly token: string;
  private readonly registry: NpmrcRegistry;

  constructor(token: string) {
    this.token = token;
    this.registry = this._constructRegistry();
  }

  /**
   * Run command.
   *
   * @throws {NpmrcFileError}
   */
  @logGroup('Setup private registry')
  public run(): void {
    core.debug(`Setting up registry: ${this.registry.url} with scope ${this.registry.scope}`);

    const npmrcFile = new NpmrcFile(this.registry, this.token);

    npmrcFile.save();

    core.exportVariable('NODE_AUTH_TOKEN', this.token);
  }

  private _constructRegistry = (): NpmrcRegistry => {
    const registry = '//npm.pkg.github.com/';
    const url = `https:${registry}`;
    const scope = '@' + github.context.repo.owner;

    return {
      registry,
      url,
      scope,
    };
  };
}

/**
 * Npmrc file representation.
 */
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
