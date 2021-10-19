"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupNpmRegistry = exports.RunNpmScript = exports.Publish = exports.InstallDependencies = exports.Build = void 0;
const build_1 = __importDefault(require("./build"));
exports.Build = build_1.default;
const installDependencies_1 = __importDefault(require("./installDependencies"));
exports.InstallDependencies = installDependencies_1.default;
const publish_1 = __importDefault(require("./publish"));
exports.Publish = publish_1.default;
const runNpmScript_1 = __importDefault(require("./runNpmScript"));
exports.RunNpmScript = runNpmScript_1.default;
const setupNpmRegistry_1 = __importDefault(require("./setupNpmRegistry"));
exports.SetupNpmRegistry = setupNpmRegistry_1.default;
