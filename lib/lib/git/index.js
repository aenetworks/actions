"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGitUser = exports.clone = void 0;
const clone_1 = __importDefault(require("./clone"));
exports.clone = clone_1.default;
const setupUser_1 = __importDefault(require("./setupUser"));
exports.setupGitUser = setupUser_1.default;
