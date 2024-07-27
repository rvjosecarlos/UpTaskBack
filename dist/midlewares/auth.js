"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../model/User");
const authentication = async (req, res, next) => {
    try {
        const bearerT = req.headers.authorization.replace('Bearer', '').trim();
        if (!bearerT) {
            return res.status(401).json({ error: 'No autorizado' });
        }
        const validBearerT = jsonwebtoken_1.default.verify(bearerT, process.env.JWT_SECRET);
        if (typeof validBearerT === 'object' && validBearerT.id) {
            const user = await User_1.User.findById(validBearerT.id).select("_id name email");
            if (user) {
                req.user = user;
                next();
            }
            else {
                return res.status(500).json({ error: 'Token no válido' });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Token no válido' });
    }
};
exports.authentication = authentication;
//# sourceMappingURL=auth.js.map