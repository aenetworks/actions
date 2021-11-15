"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VersionVo {
    constructor(major = 0, minor = 0, patch = 0, original = '') {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.original = original;
    }
    static parse(versionString) {
        const match = versionString.match(VersionVo.validVersionRegex);
        if (!match) {
            // todo error
            throw new Error('invalid version');
        }
        const { major, minor, patch } = match.groups;
        console.log(major, minor, patch);
        return new VersionVo(Number(major), Number(minor), Number(patch), versionString);
    }
    static isValidVersion(versionString) {
        return VersionVo.validVersionRegex.test(versionString);
    }
    static sortAsc(first, second) {
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
    static sortDesc(first, second) {
        return -1 * VersionVo.sortAsc(first, second);
    }
    asString() {
        if (this.original) {
            return this.original;
        }
        return `v${this.major}.${this.minor}.${this.patch}`;
    }
    asStringWithoutPrefix() {
        return this.asString().slice(1);
    }
}
exports.default = VersionVo;
VersionVo.validVersionRegex = /v?(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/;
