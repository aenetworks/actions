import * as newman from 'newman';

import { logGroup } from './decorators';
import { Command } from './seedWorks';

/**
 * Build package.
 *
 * Skipped if script 'build' does not exists.
 */
export default class Postman implements Command {
  private readonly apiUrl = 'https://api.postman.com';

  constructor(
    private readonly apiKey: string,
    private readonly collectionId: string,
    private readonly environmentId: string
  ) {}

  /**
   * Run command.
   */
  @logGroup('Postman')
  public run(): void {
    const options = {
      collection: this._getCollectionUrl(),
      environment: this._getEnvironmentUrl(),
      apiKey: this.apiKey,
    };

    newman.run(options, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  private _getCollectionUrl(): string {
    return `${this.apiUrl}/collections/${this.collectionId}?apiKey=${this.apiKey}`;
  }

  private _getEnvironmentUrl(): string {
    return `${this.apiUrl}/environments/${this.environmentId}?apiKey=${this.apiKey}`;
  }
}
