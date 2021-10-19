"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const decorators_1 = require("../decorators");
const execShellCommand_1 = __importDefault(require("../execShellCommand"));
/**
 * Describe changes based on Conventional Commits.
 */
class DescribeChanges {
    /**
     * Constructs DescribeChanges command.
     *
     * @param {boolean} [saveToFile=false] - Should save to temporary file.
     */
    constructor(saveToFile = false) {
        this.saveToFile = saveToFile;
        this._getCurrentVersion = () => {
            const cmd = 'git describe --abbrev=0 --tags | cut -c2-';
            const errorMessage = 'Cannot get current version';
            return (0, execShellCommand_1.default)({ cmd, errorMessage });
        };
    }
    /**
     * Run command.
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentVersion = this._getCurrentVersion();
            yield this._ensureRightVersionIsDescribed(currentVersion);
            // echo "$(npx standard-version --dry-run --silent | tail -n +3 | head -n -2)" > /tmp/changelog.txt
            // cat /tmp/changelog.txt
        });
    }
    _ensureRightVersionIsDescribed(currentVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageJson = require('./package.json');
            packageJson.version = currentVersion;
            console.log(packageJson);
        });
    }
}
__decorate([
    (0, decorators_1.logGroup)('Describe changes.')
], DescribeChanges.prototype, "run", null);
exports.default = DescribeChanges;
