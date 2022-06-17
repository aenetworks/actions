import * as github from '@actions/github';

import { logGroup } from '../decorators';
import { Command } from '../seedWorks';
import Summary from '../summary';

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
    const releaseUrl = res.data.html_url.replace('releases/tag/', 'releases/edit/');
    const tagUrl = res.data.html_url.split('/').slice(0, -1).join('/') + '/' + this.version;

    Summary.append(`## Draft release`);
    Summary.append('');
    Summary.append(
      `Open this [Github Release UI](${releaseUrl}) page and click green 'Publish' button to publish changes.`
    );
    Summary.append('');
    Summary.append(
      'Generated changelog may be edited before publication. You can add general release description ' +
        'before list of changes, you can also remove unimportant entries or fix typos. '
    );
    Summary.append('');
    Summary.append(
      'If you find that this release need be updated by additional commits, remember to remove draft ' +
        'release and related tag before you run Prepare Draft Release action again.'
    );
    Summary.append(`- [Draft Release](${releaseUrl})`);
    Summary.append(`- [Tag](${tagUrl})`);
    Summary.append('');
    Summary.append('## Generated Changelog:');
    Summary.append(this.changelog);
  }
}
