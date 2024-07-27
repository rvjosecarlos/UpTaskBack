"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInputErrors = void 0;
const express_validator_1 = require("express-validator");
const handleInputErrors = (req, res, next) => {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        console.log(error.array()[0].msg);
        return res.status(400).json({ error: error.array()[0].msg });
    }
    next();
};
exports.handleInputErrors = handleInputErrors;
//# sourceMappingURL=validacionGeneralRequest.js.map