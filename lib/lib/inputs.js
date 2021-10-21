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
const releaseType_1 = __importStar(require("./releaseType"));
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
    getSourceRef() {
        return core.getInput('sourceRef');
    }
    getTargetRef() {
        return core.getInput('targetRef');
    }
    getForce() {
        const value = core.getInput('force');
        if (value === 'true') {
            core.notice('"Force" set to true. It will override targetRef!');
            return true;
        }
        else if (value === 'false') {
            core.info('"Force" set to false.');
            return false;
        }
        else {
            core.warning(`"Force" has unrecognized value '${value}'. Set to false as fallback.`);
            return false;
        }
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
    isPrerelease() {
        return core.getInput('isPrerelease') === 'true';
    }
    getSkipCommit() {
        return core.getInput('skipCommit') === 'true';
    }
    getReleaseType() {
        const releaseType = core.getInput('releaseType');
        if (!releaseType || releaseType === releaseType_1.default.PROD) {
            return releaseType_1.default.PROD;
        }
        else if (releaseType === releaseType_1.default.BETA) {
            return releaseType_1.default.BETA;
        }
        else if (releaseType === releaseType_1.default.ALPHA) {
            return releaseType_1.default.ALPHA;
        }
        else if (releaseType === releaseType_1.default.RC) {
            return releaseType_1.default.RC;
        }
        throw new releaseType_1.ReleaseTypeError(`Unknown release type ${releaseType}. Should be one of: "", "${releaseType_1.default.PROD}", "${releaseType_1.default.BETA}", "${releaseType_1.default.ALPHA}", "${releaseType_1.default.RC}"`);
    }
}
exports.default = Inputs;
