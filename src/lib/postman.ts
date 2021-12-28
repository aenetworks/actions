import * as newman from 'newman';

import { logGroup } from './decorators';
import { Command, ErrorBase } from './seedWorks';

enum PostmanErrors {
  COLLECTION_LOAD_ERROR_MESSAGE = 'collection could not be loaded',
  ENVIRONMENT_LOAD_ERROR_MESSAGE = 'could not load environment',
  LOAD_ERROR_MESSAGE = 'could not load',
  API_KEY_ERROR_MESSAGE = 'Invalid API Key. Every request requires a valid API Key to be sent.',
}

interface NewmanOptions {
  collection: string;
  environment: string;
  reporters: string;
}

const Done = 'OK';

class PostmanApiError extends ErrorBase {}

class PostmanError extends ErrorBase {}

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
  public async run(): Promise<void> {
    const options: NewmanOptions = {
      collection: this._getCollectionUrl(),
      environment: this._getEnvironmentUrl(),
      reporters: 'cli',
    };

    await this._newmanRun(options);
  }

  private async _newmanRun(options: NewmanOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      newman.run(options, (err) => {
        if (err) {
          reject(this._handleError(err));
        }

        resolve(Done);
      });
    });
  }

  private _handleError(err: Error): PostmanApiError | PostmanError {
    const errorDescription = err.message.split('\n').map((v) => v.trim());

    if (
      errorDescription[0] === PostmanErrors.COLLECTION_LOAD_ERROR_MESSAGE &&
      errorDescription[2] === PostmanErrors.API_KEY_ERROR_MESSAGE
    ) {
      return new PostmanApiError('Invalid API key. Check if API key is valid.');
    } else if (errorDescription[0] === PostmanErrors.COLLECTION_LOAD_ERROR_MESSAGE) {
      return new PostmanApiError(`Collection "${this.collectionId}" cannot be loaded. Check if it exists.`);
    } else if (errorDescription[0] === PostmanErrors.ENVIRONMENT_LOAD_ERROR_MESSAGE) {
      return new PostmanApiError(`Environment "${this.environmentId}" cannot be loaded. Check if it exists.`);
    } else if (errorDescription[0] === PostmanErrors.LOAD_ERROR_MESSAGE) {
      return new PostmanApiError(errorDescription[2].trim());
    } else {
      return new PostmanError(err.message);
    }
  }

  private _getCollectionUrl(): string {
    return `${this.apiUrl}/collections/${this.collectionId}?apikey=${this.apiKey}`;
  }

  private _getEnvironmentUrl(): string {
    return `${this.apiUrl}/environments/${this.environmentId}?apikey=${this.apiKey}`;
  }
}
