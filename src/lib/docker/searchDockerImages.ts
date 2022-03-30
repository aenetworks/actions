import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';

import { logGroup } from '../decorators';
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
  /**
   * Run command.
   *
   * @throws {ShellCommandExecutionError}
   */
  @logGroup('SearchDockerImages')
  public async run(): Promise<void> {
    core.info('Searching...');
    return Promise.resolve(this.checkRequiredDependencies())
      .then(() => this.execCommand(listTagCommand))
      .then((tags) => this.replace(tags, noLineBreakRegex, empty))
      .then((tags) => this.replace(tags, noWhiteSpaceRegex, empty))
      .then((tags) => this.replace(tags, noBackSlashRegex, empty))
      .then((tags) => this.replace(tags, objDivisionRegex, separator))
      .then(this.convertTagsIntoArrayOfObjects)
      .then(this.processImageTags)
      .then(this.processLocalVerification);
  }

  private checkRequiredDependencies(): boolean {
    core.info('Checking required dependencies.');
    if (!shell.which('hub')) {
      shell.echo('Sorry, this script requires hub');
      shell.exit(1);
    }

    if (!shell.which('curl')) {
      shell.echo('Sorry, this script requires curl');
      shell.exit(1);
    }

    if (!shell.which('jq')) {
      shell.echo('Sorry, this script requires jq');
      shell.exit(1);
    }

    if (!shell.which('git')) {
      shell.echo('Sorry, this script requires git');
      shell.exit(1);
    }

    return true;
  }

  private execCommand(command): string {
    core.info(`Executing command : ${command}`);
    const result = shell.exec(command);

    if (result.code !== 0) {
      shell.echo(`Error while executing: ${command}`);
      shell.exit(1);
    }

    return result.toString();
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

  private createPullRequest(imageName, tagName, remoteVersion): void {
    const listPullRequestCommand = 'hub pr list';

    const prs = this.execCommand(listPullRequestCommand);
    const commitMessage = `chore(release): bump version to ${imageName}:${tagName}${remoteVersion}`;
    const prExists = prs.includes(commitMessage);

    if (prExists) {
      shell.echo('PR already exists');
    } else {
      const createPullRequestCommand = `hub pull-request -m "${commitMessage}"`;

      this.execCommand(createPullRequestCommand);
    }
  }

  private replaceTags(imageName, tagName, fileName, remoteVersion, localVersion): void {
    const replaceTagsCommand = `sed -i 's/${imageName}:${tagName}${localVersion}/${imageName}:${tagName}${remoteVersion}/g' ${rootDir}/${fileName}`;

    this.execCommand(replaceTagsCommand);
  }

  private configureGitUser(): void {
    const userEmailCommand = 'git config --global user.email "watchtech@aenetworks.com"';
    const userNameCommand = 'git config --global user.name "Platform Engineering"';

    this.execCommand(userEmailCommand);
    this.execCommand(userNameCommand);
  }

  private resetBranchToDevelop(): void {
    const branchName = 'develop';
    const resetBranchCommand = 'git reset --hard';
    const checkoutBranchCommand = `git checkout ${branchName}`;

    this.execCommand(resetBranchCommand);
    this.execCommand(checkoutBranchCommand);
  }

  private checkoutBranch(imageName, tagName, remoteVersion, localVersion): string {
    const branchName = `chore_${imageName}${tagName}_from_${localVersion}_to_${remoteVersion}`;
    const checkoutBranchCommand = `git checkout -b ${branchName}`;

    this.execCommand(checkoutBranchCommand);

    return branchName;
  }

  private commitChanges(imageName, tagName, remoteVersion): void {
    const commitMessage = `chore(release): bump version to ${imageName}:${tagName}${remoteVersion}`;
    const addCommand = 'git add .';
    const commitCommand = `git commit -m "${commitMessage}"`;

    this.execCommand(addCommand);
    this.execCommand(commitCommand);
  }

  private pushBranchToRemote(branchName) {
    const pushBranchCommand = `git push origin ${branchName}`;

    this.execCommand(pushBranchCommand);
  }

  private processLocalVerification(tags): void {
    core.info('Checking local version agains remote docker tags.');
    this.configureGitUser();
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
            const branchName = this.checkoutBranch(dockerImageName, prefixTagName, remoteVersion, localVersion);

            this.replaceTags(dockerImageName, prefixTagName, dockerfileName, remoteVersion, localVersion);
            this.commitChanges(dockerImageName, prefixTagName, remoteVersion);
            this.pushBranchToRemote(branchName);
            this.createPullRequest(dockerImageName, prefixTagName, remoteVersion);
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
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
    core.info('reading data from docker file => ' + filePath);
    core.info(content);
    return content;
  }
}
