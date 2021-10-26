import * as newman from 'newman';

import { logGroup } from './decorators';
import { Command, ErrorBase } from './seedWorks';

enum PostmanErrors {
  COLLECTION_LOAD_ERROR_MESSAGE = 'collection could not be loaded',
  ENVIRONMENT_LOAD_ERROR_MESSAGE = 'could not load environment',
  LOAD_ERROR_MESSAGE = 'could not load ',
}

class PostmanApiError extends ErrorBase {}

/**
 * Build package.
 *
 * Skipped if script 'build' does not exists.
 */
export default class Postman implements Command {
  private readonly apiUrl = 'https://api.getpostman.com';

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
      reporters: 'cli',
    };

    newman.run(options, (err) => {
      if (err) {
        const errorDescription = err.message.split('\n');

        console.warn(
          JSON.stringify({
            msg: errorDescription,
          })
        );

        if (errorDescription[0] === PostmanErrors.COLLECTION_LOAD_ERROR_MESSAGE) {
          throw new PostmanApiError(`Collection "${this.collectionId}" cannot be loaded. Check if it exists.`);
        } else if (errorDescription[0] === PostmanErrors.ENVIRONMENT_LOAD_ERROR_MESSAGE) {
          throw new PostmanApiError(`Environment "${this.environmentId}" cannot be loaded. Check if it exists.`);
        } else if (errorDescription[0] === PostmanErrors.LOAD_ERROR_MESSAGE) {
          throw new PostmanApiError('It cannot be loaded. Check if api key is valid.');
        }

        throw err;
      }
    });
  }

  private _getCollectionUrl(): string {
    return `${this.apiUrl}/collections/${this.collectionId}?apikey=${this.apiKey}`;
  }

  private _getEnvironmentUrl(): string {
    return `${this.apiUrl}/environments/${this.environmentId}?apikey=${this.apiKey}`;
  }
}
