"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const UserController_1 = require("../controller/UserController");
const validacionGeneralRequest_1 = require("../midlewares/validacionGeneralRequest");
const auth_1 = require("../midlewares/auth");
const router = (0, express_1.Router)();
router.post('/create-account', (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre no debe estar vacío'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'), (0, express_validator_1.body)('password_confirmation')
    .custom((value, { req }) => {
    if (req.body.password !== value) {
        throw new Error('Las contraseñas no coinciden');
    }
    return true;
}), (0, express_validator_1.body)('email')
    .isEmail().withMessage('E-mail no válido'), validacionGeneralRequest_1.handleInputErrors, UserController_1.UserController.createUser);
router.post('/confirm-account', (0, express_validator_1.body)("token")
    .notEmpty().withMessage("El token no puede ir vacío"), validacionGeneralRequest_1.handleInputErrors, UserController_1.UserController.confirmUser);
router.post('/login', (0, express_validator_1.body)('email')
    .notEmpty().withMessage('El E-mail no puede estar vacío')
    .isEmail().withMessage('E-mail no válido'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('Usuario o contraseña no válidos'), validacionGeneralRequest_1.handleInputErrors, UserController_1.UserController.login);
router.post('/request-token', (0, express_validator_1.body)('email')
    .notEmpty().withMessage('El E-mail no puede estar vacío')
    .isEmail().withMessage('E-mail no válido'), validacionGeneralRequest_1.handleInputErrors, UserController_1.UserController.requestConfirmationCode);
router.post('/forgot-password', (0, express_validator_1.body)('email')
    .notEmpty().withMessage('El E-mail no puede estar vacío')
    .isEmail().withMessage('E-mail no válido'), validacionGeneralRequest_1.handleInputErrors, UserController_1.UserController.forgotPassword);
router.post('/validate-token', (0, express_validator_1.body)('token')
    .notEmpty().withMessage('El token no puede estar vacío'), validacionGeneralRequest_1.handleInputErrors, UserController_1.UserController.validateToken);
router.post('/new-password/:token', (0, express_validator_1.param)('token')
    .isNumeric().withMessage('Token no válido'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('Usuario o contraseña no válidos')
    .notEmpty().withMessage('Debe especificar una contraseña'), (0, express_validator_1.body)('password_confirmation')
    .isLength({ min: 8 }).withMessage('Usuario o contraseña no válidos')
    .notEmpty().withMessage('Debe especificar una contraseña'), validacionGeneralRequest_1.handleInputErrors, UserController_1.UserController.newPassword);
router.get('/user', auth_1.authentication, UserController_1.UserController.user);
/* Rutas para profile */
router.put('/profile/update-profile', auth_1.authentication, (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre es obligatorio'), (0, express_validator_1.body)('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('E-mail no válido'), validacionGeneralRequest_1.handleInputErrors, UserController_1.UserController.updateProfile);
router.put('/profile/update-password', auth_1.authentication, (0, express_validator_1.body)('current_password')
    .isLength({ min: 8 }).withMessage('Contraseña no válida')
    .notEmpty().withMessage('Debe especificar una contraseña'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('Contraseña no válidos')
    .notEmpty().withMessage('Debe especificar una contraseña'), (0, express_validator_1.body)('password_confirmation')
    .isLength({ min: 8 }).withMessage('Contraseña no válidos')
    .notEmpty().withMessage('Debe especificar una contraseña'), validacionGeneralRequest_1.handleInputErrors, UserController_1.UserController.updatePassword);
router.post('/checkPassword', auth_1.authentication, (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('Contraseña no válida')
    .notEmpty().withMessage('Debe especificar una contraseña'), validacionGeneralRequest_1.handleInputErrors, UserController_1.UserController.checkPassword);
exports.default = router;
//# sourceMappingURL=routerAuth.js.map