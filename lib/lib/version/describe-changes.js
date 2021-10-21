"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const version_base_1 = __importDefault(require("./version-base"));
/**
 * Describe changes based on Conventional Commits.
 */
class DescribeChanges extends version_base_1.default {
    /**
     * Run command.
     */
    run() {
        const currentVersion = this._getCurrentVersion();
        this._ensureRightVersionIsDescribed(currentVersion);
        return this._getChangelogEntry();
    }
}
__decorate([
    (0, decorators_1.logGroup)('Describe changes')
], DescribeChanges.prototype, "run", null);
exports.default = DescribeChanges;
