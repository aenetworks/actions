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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpmrcFileError = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const decorators_1 = require("../decorators");
const seedWorks_1 = require("../seedWorks");
/**
 * Error related to .npmrc file.
 */
class NpmrcFileError extends seedWorks_1.ErrorBase {
}
exports.NpmrcFileError = NpmrcFileError;
/**
 * Setup Npm registry command.
 *
 * Configure .npmrc file containing access to actual repository organization package
 * files.
 */
class SetupNpmRegistry {
    constructor(token) {
        this._constructRegistry = () => {
            const registry = '//npm.pkg.github.com/';
            const url = `https:${registry}`;
            const scope = '@' + github.context.repo.owner;
            return {
                registry,
                url,
                scope,
            };
        };
        this.token = token;
        this.registry = this._constructRegistry();
    }
    /**
     * Run command.
     *
     * @throws {NpmrcFileError}
     */
    run() {
        core.info(`Setting up registry: ${this.registry.url} with scope ${this.registry.scope}`);
        const npmrcFile = new NpmrcFile(this.registry, this.token);
        npmrcFile.save();
        core.exportVariable('NODE_AUTH_TOKEN', this.token);
    }
}
__decorate([
    (0, decorators_1.logGroup)('Setup private registry')
], SetupNpmRegistry.prototype, "run", null);
exports.default = SetupNpmRegistry;
/**
 * Npmrc file representation.
 */
class NpmrcFile {
    /**
     * Construct Npmrc file.
     *
     * @param {NpmrcRegistry} registry - Registry data.
     * @param {string} token - Npm token.
     */
    constructor(registry, token) {
        this.content = this._getContent(registry, token);
    }
    _getContent(registry, token) {
        let content = '';
        if (fs.existsSync(this._getLocation())) {
            content = this._readCurrentNpmrcFile();
        }
        content += `${registry.scope}:registry=${registry.url}${os.EOL}`;
        content += `${registry.registry}:_authToken=${token}`;
        return content;
    }
    _getLocation() {
        return path.resolve(process.cwd(), '.npmrc');
    }
    /**
     * Save current file to disk.
     *
     * @throws {NpmrcFileError}
     */
    save() {
        try {
            fs.writeFileSync(this._getLocation(), this.content);
            core.exportVariable('NPM_CONFIG_USERCONFIG', this._getLocation());
        }
        catch (e) {
            // @ts-ignore
            throw new NpmrcFileError('Cannot save .npmrc file: ' + e.message);
        }
    }
    _readCurrentNpmrcFile() {
        let content = '';
        const currentNpmrc = fs.readFileSync(this._getLocation(), 'utf8');
        currentNpmrc.split(os.EOL).forEach((line) => {
            if (!line.toLowerCase().startsWith('registry')) {
                content += line + os.EOL;
            }
        });
        return content;
    }
}
