import FailedEslintChecksHandler from '../failedEslintChecksHandler';
import * as testData from './__data__/failedEslintChecksHandler.data';

describe('FailedEslintChecksHandler', () => {
  it('return error single jest output', () => {
    const handledError = FailedEslintChecksHandler.handle(testData.SINGLE.error) as Error;

    expect(handledError.name).toBe('EslintChecksFailed');
    expect(handledError.message).toEqual(testData.SINGLE.message);
  });

  it('return error on monorepo jest output', () => {
    const handledError = FailedEslintChecksHandler.handle(testData.MONOREPO.error) as Error;

    expect(handledError.name).toBe('EslintChecksFailed');
    expect(handledError.message).toEqual(testData.MONOREPO.message);
  });
});
