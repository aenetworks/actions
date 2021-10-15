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
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const error_1 = require("../error");
/**
 * Setup Npm registryl
 *
 * @param {string} token - Npm token.
 * @throws {NpmrcFileError}
 */
const setupRegistry = ({ token }) => {
    core.startGroup('Setup private registry');
    const registry = _constructRegistry();
    const npmrcFile = new NpmrcFile(registry, token);
    console.debug(`Setting up registry: ${registry.url} with scope ${registry.scope}`);
    npmrcFile.save();
    core.exportVariable('NODE_AUTH_TOKEN', token);
    core.endGroup();
};
const _constructRegistry = () => {
    const registry = '//npm.pkg.github.com/';
    const url = `https:${registry}`;
    const scope = '@' + github.context.repo.owner;
    return {
        registry,
        url,
        scope,
    };
};
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
            throw new error_1.NpmrcFileError('Cannot save .npmrc file: ' + e.message);
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
exports.default = setupRegistry;
