"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = __importDefault(require("../version"));
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
            expect(version_1.default.isValidVersion(v)).toBeTruthy();
        });
        it.each([...invalidVersions])('version "%s" should be not valid', (v) => {
            expect(version_1.default.isValidVersion(v)).toBeFalsy();
        });
    });
});
