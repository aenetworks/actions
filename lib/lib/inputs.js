"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
class Inputs {
    constructor() {
        this.context = github.context;
    }
    getRepository() {
        return `${this.context.repo.owner}/${this.context.repo.repo}`;
    }
    getRef() {
        return core.getInput('ref');
    }
    getGithubToken() {
        return core.getInput('token');
    }
    getNpmAuthToken() {
        return core.getInput('npmAuthToken') || process.env.NPM_AUTH_TOKEN || '';
    }
    getScriptName() {
        return core.getInput('script');
    }
    getBotUsername() {
        return core.getInput('botUsername') || process.env.BOT_NAME || '';
    }
    getBotEmail() {
        return core.getInput('botEmail') || process.env.BOT_EMAIL || '';
    }
}
exports.default = Inputs;
