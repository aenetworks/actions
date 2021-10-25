"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBase = exports.Command = void 0;
const command_1 = __importDefault(require("./command"));
exports.Command = command_1.default;
const errorBase_1 = __importDefault(require("./errorBase"));
exports.ErrorBase = errorBase_1.default;
