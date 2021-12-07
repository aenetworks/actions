export enum Pre {
  ALPHA = 'alpha',
  BETA = 'beta',
  RC = 'rc',
}

export default class VersionVo {
  static readonly validVersionRegex =
    /v?(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(-(?<pre>alpha|beta|rc)\.(?<preV>\d))?$/;
  constructor(
    public readonly major: number = 0,
    public readonly minor: number = 0,
    public readonly patch: number = 0,
    public readonly pre: Pre | null = null,
    public readonly preV: number | null = null,
    public readonly original: string = ''
  ) {}

  static parse(versionString: string): VersionVo {
    const match = versionString.match(VersionVo.validVersionRegex);

    if (!match) {
      // todo error
      throw new Error('invalid version');
    }

    const { major, minor, patch, pre, preV } = match.groups as {
      major: string;
      minor: string;
      patch: string;
      pre: string | undefined;
      preV: string | undefined;
    };

    const parsedPre = pre ? Pre[pre.toUpperCase()] : null;
    const parsedPreV = preV ? Number(preV) : null;

    return new VersionVo(Number(major), Number(minor), Number(patch), parsedPre, parsedPreV, versionString);
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

    return this.asStringWithtPrefix();
  }

  _prereleaseSuffix(): string {
    if (this.isPrerelease) {
      return `-${this.pre}.${this.preV}`;
    }

    return '';
  }

  asStringWithtPrefix(): string {
    return `v${this.major}.${this.minor}.${this.patch}${this._prereleaseSuffix()}`;
  }

  asStringWithoutPrefix(): string {
    return `${this.major}.${this.minor}.${this.patch}${this._prereleaseSuffix()}`;
  }

  get isPrerelease(): boolean {
    return Boolean(this.pre);
  }
}
