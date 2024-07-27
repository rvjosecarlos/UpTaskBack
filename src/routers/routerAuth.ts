import { Router } from "express";
import { body, param } from "express-validator";
import { UserController } from "../controller/UserController";
import { handleInputErrors } from "../midlewares/validacionGeneralRequest";
import { authentication } from "../midlewares/auth";

const router = Router();

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no debe estar vacío'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, { req })=>{
            if( req.body.password !== value ){
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    UserController.createUser
);

router.post('/confirm-account',
    body("token")
        .notEmpty().withMessage("El token no puede ir vacío"),
    handleInputErrors,
    UserController.confirmUser
);

router.post('/login',
    body('email')
        .notEmpty().withMessage('El E-mail no puede estar vacío')
        .isEmail().withMessage('E-mail no válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('Usuario o contraseña no válidos'),
    handleInputErrors,
    UserController.login
);

router.post('/request-token',
    body('email')
        .notEmpty().withMessage('El E-mail no puede estar vacío')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    UserController.requestConfirmationCode
);

router.post('/forgot-password', 
    body('email')
        .notEmpty().withMessage('El E-mail no puede estar vacío')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    UserController.forgotPassword
);

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El token no puede estar vacío'),
    handleInputErrors,
    UserController.validateToken
);

router.post('/new-password/:token',
    param('token')
        .isNumeric().withMessage('Token no válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('Usuario o contraseña no válidos')
        .notEmpty().withMessage('Debe especificar una contraseña'),
    body('password_confirmation')
        .isLength({ min: 8 }).withMessage('Usuario o contraseña no válidos')
        .notEmpty().withMessage('Debe especificar una contraseña'),
    handleInputErrors,
    UserController.newPassword
);

router.get('/user',
    authentication,
    UserController.user
);

/* Rutas para profile */
router.put('/profile/update-profile',
    authentication,
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    UserController.updateProfile
);

router.put('/profile/update-password',
    authentication,
    body('current_password')
        .isLength({ min: 8 }).withMessage('Contraseña no válida')
        .notEmpty().withMessage('Debe especificar una contraseña'),
    body('password')
        .isLength({ min: 8 }).withMessage('Contraseña no válidos')
        .notEmpty().withMessage('Debe especificar una contraseña'),
    body('password_confirmation')
        .isLength({ min: 8 }).withMessage('Contraseña no válidos')
        .notEmpty().withMessage('Debe especificar una contraseña'),
    handleInputErrors,
    UserController.updatePassword
);

router.post('/checkPassword',
    authentication,
    body('password')
        .isLength({ min: 8 }).withMessage('Contraseña no válida')
        .notEmpty().withMessage('Debe especificar una contraseña'),
    handleInputErrors,
    UserController.checkPassword
);

export default router;