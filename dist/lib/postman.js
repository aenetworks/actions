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
const newman = __importStar(require("newman"));
const decorators_1 = require("./decorators");
const seedWorks_1 = require("./seedWorks");
var PostmanErrors;
(function (PostmanErrors) {
    PostmanErrors["COLLECTION_LOAD_ERROR_MESSAGE"] = "collection could not be loaded";
    PostmanErrors["ENVIRONMENT_LOAD_ERROR_MESSAGE"] = "could not load environment";
    PostmanErrors["LOAD_ERROR_MESSAGE"] = "could not load ";
})(PostmanErrors || (PostmanErrors = {}));
class PostmanApiError extends seedWorks_1.ErrorBase {
}
/**
 * Build package.
 *
 * Skipped if script 'build' does not exists.
 */
class Postman {
    constructor(apiKey, collectionId, environmentId) {
        this.apiKey = apiKey;
        this.collectionId = collectionId;
        this.environmentId = environmentId;
        this.apiUrl = 'https://api.getpostman.com';
    }
    /**
     * Run command.
     */
    run() {
        const options = {
            collection: this._getCollectionUrl(),
            environment: this._getEnvironmentUrl(),
            reporters: 'cli',
        };
        newman.run(options, (err) => {
            if (err) {
                const errorDescription = err.message.split('\n');
                console.warn(JSON.stringify({
                    msg: errorDescription,
                }));
                if (errorDescription[0] === PostmanErrors.COLLECTION_LOAD_ERROR_MESSAGE) {
                    throw new PostmanApiError(`Collection "${this.collectionId}" cannot be loaded. Check if it exists.`);
                }
                else if (errorDescription[0] === PostmanErrors.ENVIRONMENT_LOAD_ERROR_MESSAGE) {
                    throw new PostmanApiError(`Environment "${this.environmentId}" cannot be loaded. Check if it exists.`);
                }
                else if (errorDescription[0] === PostmanErrors.LOAD_ERROR_MESSAGE) {
                    throw new PostmanApiError('It cannot be loaded. Check if api key is valid.');
                }
                throw err;
            }
        });
    }
    _getCollectionUrl() {
        return `${this.apiUrl}/collections/${this.collectionId}?apikey=${this.apiKey}`;
    }
    _getEnvironmentUrl() {
        return `${this.apiUrl}/environments/${this.environmentId}?apikey=${this.apiKey}`;
    }
}
__decorate([
    (0, decorators_1.logGroup)('Postman')
], Postman.prototype, "run", null);
exports.default = Postman;
