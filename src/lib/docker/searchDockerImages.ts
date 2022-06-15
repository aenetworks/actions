import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';

import { logGroup } from '../decorators';
import execShellCommand from '../execShellCommand';
import { Command } from '../seedWorks';

const rootDir = path.resolve('./');

const dockerfileName = 'Dockerfile';
const dockerImageName = 'node';

const listTagCommand = `curl -sS \
   -H "Accept: application/vnd.github.v3+json" \
   -H "Authorization: Bearer ${process.env.NPM_AUTH_TOKEN}" \
   https://api.github.com/orgs/aenetworks/packages/container/node/versions | jq -r '.[]|{tags: .metadata.container.tags}'
  `;
const empty = '';
const noLineBreakRegex = new RegExp(/\\n/g);
const noWhiteSpaceRegex = new RegExp(/\s+/g);
const noBackSlashRegex = new RegExp(/\\/g);
const objDivisionRegex = new RegExp(/}{/g);
const separator = '},{';
const versionRegex = new RegExp(/(\d+.\d+|\d+.\d+.\d+)/g);
const fullVersionNameRegex = new RegExp(/\d+-alpine\d+.*/i);
const prefixVersionNameRegex = new RegExp(/\d+-alpine/i);

interface Tag {
  tags: string[];
}

/**
 * Search for new versions of the base docker images.
 *
 */
export default class SearchDockerImagesRepository implements Command {
  private readonly longTimeout: number;
  private readonly shortTimeout: number;

  constructor(private readonly token: string) {
    this.shortTimeout = 30_000;
    this.longTimeout = 2_700_000;
  }

  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  @logGroup('SearchDockerImages')
  public async run(): Promise<void> {
    core.info('Searching...');

    let result = execShellCommand({ cmd: listTagCommand, silent: true, timeout: this.longTimeout });

    result = this.replace(result, noLineBreakRegex, empty);
    result = this.replace(result, noWhiteSpaceRegex, empty);
    result = this.replace(result, noBackSlashRegex, empty);
    result = this.replace(result, objDivisionRegex, separator);

    const convertedTags = this.convertTagsIntoArrayOfObjects(result);
    const tags = this.processImageTags(convertedTags);

    await this.processLocalVerification(tags);
  }

  private replace(text, regex, value): string {
    return text.trim().replace(regex, value);
  }

  private convertTagsIntoArrayOfObjects(result): Tag[] {
    core.info('Converting tags');

    return JSON.parse(`[${result}]`);
  }

  private processImageTags(images: Tag[]) {
    core.info('Processing image tags');

    const imagesWithTags = images.filter((image) => image.tags.length > 0);
    const tags: string[] = [];

    const fileContent = this.getDockerfileContent(dockerfileName);
    const searchableKeyword = 'FROM';

    let prefixTagName;

    if (fileContent.trim().startsWith(searchableKeyword)) {
      const matches = fileContent.match(prefixVersionNameRegex);

      if (matches && matches.length > 0) {
        prefixTagName = matches[0];

        imagesWithTags.forEach((image) => {
          tags.push(
            ...image.tags.filter((tag) => fullVersionNameRegex.test(tag.trim()) && tag.startsWith(prefixTagName))
          );
        });
      }
    }

    return tags
      .map((tag) => this.replace(tag, prefixTagName, empty))
      .sort((v1, v2) => {
        const [aMajor, aMinor] = v1.split('.');
        const [bMajor, bMinor] = v2.split('.');
        const resMajor = parseInt(aMajor) - parseInt(bMajor);

        if (resMajor === 0) {
          return parseInt(aMinor) - parseInt(bMinor);
        }

        return resMajor;
      });
  }

  private async createPullRequest(branchName, imageName, tagName, remoteVersion) {
    const octokit = github.getOctokit(this.token);
    const prs = await octokit.rest.pulls.list({
      ...github.context.repo,
      state: 'open',
    });

    const commitMessage = `chore(release): :whale: upgrade node alpine to ${imageName}:${tagName}${remoteVersion}`;
    const prExists = prs.data.filter((e) => e.title === commitMessage);

    if (prExists.length > 0) {
      shell.echo('PR already exists');
    } else {
      octokit.rest.pulls.create({
        ...github.context.repo,
        title: commitMessage,
        base: 'develop',
        head: branchName,
      });
    }
  }

  private replaceTags(imageName, tagName, fileName, remoteVersion, localVersion): void {
    const replaceTagsCommand = `sed -i 's/${imageName}:${tagName}${localVersion}/${imageName}:${tagName}${remoteVersion}/g' ${rootDir}/${fileName}`;

    execShellCommand({ cmd: replaceTagsCommand, timeout: this.shortTimeout });
  }

  private resetBranchToDevelop(): void {
    const branchName = 'develop';
    const resetBranchCommand = 'git reset --hard';
    const checkoutBranchCommand = `git checkout ${branchName}`;

    execShellCommand({ cmd: resetBranchCommand, timeout: this.shortTimeout });
    execShellCommand({ cmd: checkoutBranchCommand, timeout: this.shortTimeout });
  }

  private checkoutBranch(branchName) {
    const checkoutBranchCommand = `git checkout -b ${branchName}`;

    execShellCommand({ cmd: checkoutBranchCommand, timeout: this.shortTimeout });
  }

  private commitChanges(imageName, tagName, remoteVersion): void {
    const commitMessage = `chore(release): :whale: upgrade node alpine to ${imageName}:${tagName}${remoteVersion}`;
    const addCommand = 'git add .';
    const commitCommand = `git commit -m "${commitMessage}"`;

    execShellCommand({ cmd: addCommand, timeout: this.shortTimeout });
    execShellCommand({ cmd: commitCommand, timeout: this.shortTimeout });
  }

  private pushBranchToRemote(branchName) {
    const pushBranchCommand = `git push origin ${branchName}`;

    execShellCommand({ cmd: pushBranchCommand, timeout: this.shortTimeout });
  }

  private async processLocalVerification(tags) {
    core.info('Checking local version against remote docker tags.');
    this.resetBranchToDevelop();

    const fileContent = this.getDockerfileContent(dockerfileName);
    const searchableKeyword = 'FROM';

    if (fileContent.trim().startsWith(searchableKeyword)) {
      const fullVersionNameMatches = fileContent.match(fullVersionNameRegex);
      const prefixVersionMatches = fileContent.match(prefixVersionNameRegex);

      if (
        fullVersionNameMatches &&
        fullVersionNameMatches.length > 0 &&
        prefixVersionMatches &&
        prefixVersionMatches.length > 0
      ) {
        const fullTagName = fullVersionNameMatches[0];
        const prefixTagName = prefixVersionMatches[0];

        const versionMatches = fullTagName.match(versionRegex);

        if (versionMatches && versionMatches.length > 0) {
          const localVersion = parseFloat(versionMatches[0]);
          const remoteVersion = parseFloat(tags[tags.length - 1]);

          if (remoteVersion > localVersion) {
            const branchName = `chore_${dockerImageName}${prefixTagName}_from_${localVersion}_to_${remoteVersion}`;

            const remoteBranchResult = shell.exec(`git ls-remote --heads origin ${branchName}`)[0];

            if (remoteBranchResult?.trim()?.length > 0) {
              shell.echo('Your branch is up to date!');
            } else {
              this.checkoutBranch(branchName);

              this.replaceTags(dockerImageName, prefixTagName, dockerfileName, remoteVersion, localVersion);
              this.commitChanges(dockerImageName, prefixTagName, remoteVersion);
              this.pushBranchToRemote(branchName);
              await this.createPullRequest(branchName, dockerImageName, prefixTagName, remoteVersion);
            }
          } else {
            shell.echo('Your branch is up to date!');
          }
        }
      }
    }

    core.info('Search tags completed!');
  }

  private getDockerfileContent(relativeFilePath): string {
    const filePath = `${rootDir}/${relativeFilePath}`;

    return fs.readFileSync(filePath, { encoding: 'utf-8' });
  }
}
