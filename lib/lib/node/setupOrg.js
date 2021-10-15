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
const getNpmrcLocation = () => path.resolve(process.cwd(), '.npmrc');
const getRegistry = () => {
    const registry = '//npm.pkg.github.com/';
    const url = `https:${registry}`;
    const scope = '@' + github.context.repo.owner;
    return {
        registry,
        url,
        scope,
    };
};
const buildNpmrcFile = (registry, token) => {
    let npmrcContent = '';
    if (fs.existsSync(getNpmrcLocation())) {
        const currentNpmrc = fs.readFileSync(getNpmrcLocation(), 'utf8');
        currentNpmrc.split(os.EOL).forEach((line) => {
            if (!line.toLowerCase().startsWith('registry')) {
                npmrcContent += line + os.EOL;
            }
        });
    }
    npmrcContent += `${registry.scope}:registry=${registry.url}${os.EOL}`;
    npmrcContent += `${registry.registry}:_authToken=${token}`;
    return npmrcContent;
};
const writeNpmrcFile = (npmrcFileContent) => {
    fs.writeFileSync(getNpmrcLocation(), npmrcFileContent);
    core.exportVariable('NPM_CONFIG_USERCONFIG', getNpmrcLocation());
};
const setupRegistry = (token) => {
    core.startGroup('Setup private registry');
    const registry = getRegistry();
    console.debug(`Setting up registry: ${registry.url} with scope ${registry.scope}`);
    const npmrcFile = buildNpmrcFile(registry, token);
    writeNpmrcFile(npmrcFile);
    core.exportVariable('NODE_AUTH_TOKEN', token);
    core.endGroup();
};
exports.default = setupRegistry;
