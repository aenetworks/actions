"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupGitUser = exports.Push = exports.MergeBranches = exports.CloneRepository = void 0;
const cloneRepository_1 = __importDefault(require("./cloneRepository"));
exports.CloneRepository = cloneRepository_1.default;
const mergeBranches_1 = __importDefault(require("./mergeBranches"));
exports.MergeBranches = mergeBranches_1.default;
const push_1 = __importDefault(require("./push"));
exports.Push = push_1.default;
const setupGitUser_1 = __importDefault(require("./setupGitUser"));
exports.SetupGitUser = setupGitUser_1.default;
