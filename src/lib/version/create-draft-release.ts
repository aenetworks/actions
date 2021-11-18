import * as core from '@actions/core';
import * as github from '@actions/github';

import { logGroup } from '../decorators';
import { Command } from '../seedWorks';

export default class CreateDraftRelease implements Command {
  constructor(
    private readonly token: string,
    private readonly version: string,
    private readonly isPrerelease: boolean,
    private readonly changelog: string
  ) {}

  /**
   * Run command.
   */
  @logGroup('Create draft release')
  public async run(): Promise<void> {
    const octokit = github.getOctokit(this.token);

    const res = await octokit.rest.repos.createRelease({
      ...github.context.repo,
      tag_name: this.version,
      name: this.version,
      body: this.changelog,
      draft: true,
      prerelease: this.isPrerelease,
    });

    core.notice(`Draft release: ${res.data.html_url.replace('releases/tag/', 'releases/edit/')}`);
  }
}
