import Version from '../version';

const testVersions = [
  '0.0.0',
  '0.0.1',
  '0.0.1123123123',
  '0.1.0',
  '0.1123123123.0',
  '1.0.0',
  '123123.0.0',
  '123123.123123213.123123123123',
];

const testVersionsWithPrefix = testVersions.map((version) => `v${version}`);

const invalidVersions = ['a', 'some-string', '0.1', 'v0.1', '1', 'v1'];

describe('Version', function () {
  describe('version regex', () => {
    it.each([...testVersions, ...testVersionsWithPrefix])('version "%s" should be valid', (v) => {
      expect(Version.isValidVersion(v)).toBeTruthy();
    });

    it.each([...invalidVersions])('version "%s" should be not valid', (v) => {
      expect(Version.isValidVersion(v)).toBeFalsy();
    });
  });
});
