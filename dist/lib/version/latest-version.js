"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const releaseType_1 = __importDefault(require("../releaseType"));
const version_base_1 = __importDefault(require("./version-base"));
/**
 * Describe changes based on Conventional Commits.
 */
class LatestVersion extends version_base_1.default {
    constructor() {
        super(releaseType_1.default.PROD);
    }
    /**
     * Run command.
     */
    run() {
        return this._getLatestVersion();
    }
}
exports.default = LatestVersion;
