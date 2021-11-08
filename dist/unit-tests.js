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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const git_1 = require("./lib/git");
const inputs_1 = __importDefault(require("./lib/inputs"));
const node_1 = require("./lib/node");
async function run() {
    try {
        const inputs = new inputs_1.default();
        const repository = inputs.getRepository();
        const githubToken = inputs.getGithubToken();
        const ref = inputs.getRef();
        const npmAuthToken = inputs.getNpmAuthToken();
        const unitTestsCommand = new node_1.RunNpmScript('test');
        new git_1.CloneRepository(repository, githubToken, ref).run();
        if (!unitTestsCommand.hasScript()) {
            core.notice('Unit tests job skipped, because script "test" does not exists in package.json');
        }
        else {
            new node_1.SetupNpmRegistry(npmAuthToken).run();
            new node_1.InstallDependencies().run();
            unitTestsCommand.run();
        }
    }
    catch (error) {
        // @ts-ignore
        core.setFailed(error);
    }
}
run();
