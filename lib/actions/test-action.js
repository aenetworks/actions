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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const git_1 = require("../lib/git");
const inputs_1 = __importDefault(require("../lib/inputs"));
const node_1 = require("../lib/node");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inputs = new inputs_1.default();
            const repository = inputs.getRepository();
            const githubToken = inputs.getGithubToken();
            const ref = inputs.getRef();
            const botUsername = inputs.getBotUsername();
            const botEmail = inputs.getBotEmail();
            const npmAuthToken = inputs.getNpmAuthToken();
            new git_1.CloneRepository(repository, githubToken, ref).run();
            new git_1.SetupGitUser(botUsername, botEmail).run();
            new node_1.SetupNpmRegistry(npmAuthToken).run();
            new node_1.InstallDependencies().run();
            new node_1.RunNpmScript('test').run();
        }
        catch (error) {
            // @ts-ignore
            core.setFailed(error.message);
        }
    });
}
run();
