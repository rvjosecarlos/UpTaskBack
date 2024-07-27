"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const colors_1 = __importDefault(require("colors"));
const corsOptions = {
    origin: (origin, callback) => {
        const whiteList = [process.env.FRONTEND_URL];
        const argumentosNode = process.argv;
        if (whiteList.includes(origin) || argumentosNode[2] === undefined) {
            callback(null, true);
        }
        else {
            console.log(colors_1.default.red.bold('Error de CORS ' + origin));
            callback(new Error('Error de CORS'));
        }
    }
};
exports.corsOptions = corsOptions;
//# sourceMappingURL=corsOptions.js.map