export default class VersionVo {
  static readonly validVersionRegex = /v?(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/;
  constructor(
    public readonly major: number = 0,
    public readonly minor: number = 0,
    public readonly patch: number = 0,
    public readonly original: string = ''
  ) {}

  static parse(versionString: string): VersionVo {
    const match = versionString.match(VersionVo.validVersionRegex);

    if (!match) {
      // todo error
      throw new Error('invalid version');
    }

    const { major, minor, patch } = match.groups as { major: string; minor: string; patch: string };

    return new VersionVo(Number(major), Number(minor), Number(patch), versionString);
  }

  static isValidVersion(versionString: string): boolean {
    return VersionVo.validVersionRegex.test(versionString);
  }

  static sortAsc(first: VersionVo, second: VersionVo): number {
    const comparedMajor = first.major - second.major;

    if (comparedMajor !== 0) {
      return comparedMajor;
    }

    const comparedMinor = first.minor - second.minor;

    if (comparedMinor !== 0) {
      return comparedMinor;
    }

    return first.patch - second.patch;
  }

  static sortDesc(first, second): number {
    return -1 * VersionVo.sortAsc(first, second);
  }

  asString(): string {
    if (this.original) {
      return this.original;
    }

    return `v${this.major}.${this.minor}.${this.patch}`;
  }

  asStringWithoutPrefix(): string {
    return this.asString().slice(1);
  }
}
