import FailedJestTestsHandler from '../failedJestTestsHandler';
import * as testData from './__data__/failedJestTestsHandler.data';

describe('FailedJestTestsHandler', () => {
  it('return error single jest output', () => {
    const handledError = FailedJestTestsHandler.handle(testData.SINGLE.error) as Error;

    expect(handledError.name).toBe('JestTestsFailed');
    expect(handledError.message).toEqual(testData.SINGLE.message);
  });

  it('return error on monorepo jest output', () => {
    const handledError = FailedJestTestsHandler.handle(testData.MONOREPO.error) as Error;

    expect(handledError.name).toBe('JestTestsFailed');

    expect(handledError.message).toEqual(testData.MONOREPO.message);
  });
});
