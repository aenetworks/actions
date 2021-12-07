import exp from 'constants';

import VersionVO, { Pre } from '../version-vo';

const testVersions = [
  '0.0.0',
  '0.0.1',
  '0.0.1123123123',
  '0.1.0',
  '0.1123123123.0',
  '1.0.0',
  '123123.0.0',
  '123123.123123213.123123123123',
  '1.1.0-beta.0',
  '1.1.0-alpha.3',
  '1.1.2-rc.1',
];

const testVersionsWithPrefix = testVersions.map((version) => `v${version}`);

const invalidVersions = ['a', 'some-string', '0.1', 'v0.1', '1', 'v1', '1.1.2-pre.1'];

describe('Version', function () {
  describe('version regex', () => {
    it.each([...testVersions, ...testVersionsWithPrefix])('version "%s" should be valid', (v) => {
      expect(VersionVO.isValidVersion(v)).toBeTruthy();
    });

    it.each([...invalidVersions])('version "%s" should be not valid', (v) => {
      expect(VersionVO.isValidVersion(v)).toBeFalsy();
    });
  });

  describe('parse version', () => {
    it('should parse regular version', () => {
      const version = VersionVO.parse('v1.0.4');

      expect(version.major).toBe(1);
      expect(version.minor).toBe(0);
      expect(version.patch).toBe(4);
      expect(version.pre).toBeNull();
      expect(version.preV).toBeNull();
      expect(version.isPrerelease).toBeFalsy();
      expect(version.asStringWithtPrefix()).toBe('v1.0.4');
      expect(version.asStringWithoutPrefix()).toBe('1.0.4');
      expect(version.asString()).toBe('v1.0.4');
    });

    it('should parse prerelease version', () => {
      const version = VersionVO.parse('v2.1.0-beta.0');

      expect(version.major).toBe(2);
      expect(version.minor).toBe(1);
      expect(version.patch).toBe(0);
      expect(version.pre).toBe(Pre.BETA);
      expect(version.preV).toBe(0);
      expect(version.isPrerelease).toBeTruthy();
      expect(version.asStringWithtPrefix()).toBe('v2.1.0-beta.0');
      expect(version.asStringWithoutPrefix()).toBe('2.1.0-beta.0');
      expect(version.asString()).toBe('v2.1.0-beta.0');
    });
  });
});
