"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRegistry = exports.runScript = exports.installDependencies = void 0;
const installDependencies_1 = __importDefault(require("./installDependencies"));
exports.installDependencies = installDependencies_1.default;
const runScript_1 = __importDefault(require("./runScript"));
exports.runScript = runScript_1.default;
const setupOrg_1 = __importDefault(require("./setupOrg"));
exports.setupRegistry = setupOrg_1.default;
