"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupNpmRegistry = exports.RunNpmScript = exports.InstallDependencies = void 0;
const installDependencies_1 = __importDefault(require("./installDependencies"));
exports.InstallDependencies = installDependencies_1.default;
const runNpmScript_1 = __importDefault(require("./runNpmScript"));
exports.RunNpmScript = runNpmScript_1.default;
const setupNpmRegistry_1 = __importDefault(require("./setupNpmRegistry"));
exports.SetupNpmRegistry = setupNpmRegistry_1.default;
