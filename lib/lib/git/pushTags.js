"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const execShellCommand_1 = __importDefault(require("../execShellCommand"));
class PushTags {
    constructor(ref) {
        this.ref = ref;
        this._pushTags = () => {
            const cmd = `git push --follow-tags -set-upstream origin ${this.ref}`;
            (0, execShellCommand_1.default)({
                cmd,
            });
        };
    }
    /**
     * Run command.
     */
    run() {
        this._pushTags();
    }
}
__decorate([
    (0, decorators_1.logGroup)('Push tags')
], PushTags.prototype, "run", null);
exports.default = PushTags;
