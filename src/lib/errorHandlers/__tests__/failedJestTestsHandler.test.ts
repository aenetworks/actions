import FailedJestTestsHandler from '../failedJestTestsHandler';
import * as testData from './__data__/failedJestTestHandler.data';

describe('FailedJestTestsHandler', () => {
  it('return error on monorepo jest output', () => {
    const handledError = FailedJestTestsHandler.handle(testData.MONOREPO_FAILED.error) as Error;

    expect(handledError.name).toBe('JestTestsFailed');
    expect(handledError.message).toEqual(testData.MONOREPO_FAILED.message);
  });

  it('return error single jest output', () => {
    const handledError = FailedJestTestsHandler.handle(testData.SINGLE_REPO_FAILED.error) as Error;

    expect(handledError.name).toBe('JestTestsFailed');
    expect(handledError.message).toEqual(testData.SINGLE_REPO_FAILED.message);
  });
});
