"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const colors_1 = __importDefault(require("colors"));
const User_1 = require("../model/User");
const Token_1 = require("../model/Token");
const auth_1 = require("../utils/auth");
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class UserController {
    static createUser = async (req, res) => {
        try {
            const { password, email } = req.body;
            // Prevenir duplicados
            const userExist = await User_1.User.findOne({ email });
            if (userExist) {
                const error = new Error('El usuario ya se encuentra registrado');
                return res.status(409).json({ error: error.message });
            }
            ;
            // Crear usuario
            const user = new User_1.User(req.body);
            user.password = await (0, auth_1.hashPassword)(password);
            // Crear token
            const token = new Token_1.Token();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            // Enviar correo electrónico
            await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                name: user.name,
                token: token.token,
                email: user.email
            });
            await Promise.allSettled([user.save(), token.save()]);
            return res.send('Cuenta creada; revisa tu email para confirmarla');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static confirmUser = async (req, res) => {
        try {
            // Validar que el token exista
            const token = await Token_1.Token.findOne({ token: req.body.token });
            if (!token) {
                const error = new Error('Token no válido');
                return res.status(404).json({ error: error.message });
            }
            ;
            // Confirmar al usuario
            const user = await User_1.User.findById(token.user);
            user.confirmed = true;
            // Guardar cambios y eliminar el token
            await Promise.allSettled([user.save(), token.deleteOne()]);
            res.send('Cuenta confirmada');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static login = async (req, res) => {
        try {
            // Validar que el usuario exista
            const user = await User_1.User.findOne({ email: req.body.email });
            if (!user) {
                const error = new Error('Usuario no registrado');
                return res.status(404).json({ error: error.message });
            }
            ;
            // Validar que el usuario este confirmado
            if (!user.confirmed) {
                const oldToken = await Token_1.Token.findOne({ user: user.id });
                if (oldToken) {
                    await oldToken.deleteOne();
                }
                ;
                const newToken = new Token_1.Token();
                newToken.user = user.id;
                newToken.token = (0, token_1.generateToken)();
                await newToken.save();
                await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    name: user.name,
                    token: newToken.token,
                    email: user.email
                });
                const error = new Error('Usuario no confirmado. Hemos enviado un nuevo token de confirmación a tu cuenta de correo electrónico');
                return res.status(401).json({ error: error.message });
            }
            // Validar que la contraseña sea correcta
            const validPassword = await (0, auth_1.checkPassword)(req.body.password, user.password);
            if (!validPassword) {
                const error = new Error('Usuario o contraseña no válidos');
                return res.status(401).json({ error: error.message });
            }
            // Genera un JWT para mantener la sesión
            const jwToken = (0, jwt_1.generateJWT)({ id: user.id });
            res.send(jwToken);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static requestConfirmationCode = async (req, res) => {
        try {
            const user = await User_1.User.findOne({ email: req.body.email });
            if (!user) {
                const error = new Error('Correo electrónico no registrado');
                return res.status(404).json({ error: error.message });
            }
            ;
            if (user.confirmed) {
                const error = new Error('El correo ya se encuentra confirmado');
                return res.status(403).json({ error: error.message });
            }
            ;
            const oldToken = await Token_1.Token.findOne({ user: user.id });
            if (oldToken) {
                await oldToken.deleteOne();
            }
            ;
            const newToken = new Token_1.Token();
            newToken.token = (0, token_1.generateToken)();
            newToken.user = user.id;
            await newToken.save();
            await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                name: user.name,
                token: newToken.token,
                email: user.email
            });
            res.send('Se ha enviado un nuevo código de confirmación a tu cuenta de correo electrónico');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            const userExist = await User_1.User.findOne({ email: req.body.email });
            if (!userExist) {
                const error = new Error("Usuario no registrado");
                return res.status(404).json({ error: error.message });
            }
            ;
            const oldToken = await Token_1.Token.findOne({ user: userExist.id });
            if (oldToken) {
                await oldToken.deleteOne();
            }
            ;
            console.log(colors_1.default.bgBlue.bold(new Date(Date.now()).toString()));
            const newToken = new Token_1.Token();
            newToken.user = userExist.id,
                newToken.token = (0, token_1.generateToken)();
            await newToken.save();
            await AuthEmail_1.AuthEmail.sendPasswordResetToken({
                name: userExist.name,
                email: userExist.email,
                token: newToken.token
            });
            return res.send("Se envió un nuevo toke a tu E-mail");
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const tokenExist = await Token_1.Token.findOne({ token: req.body.token });
            if (!tokenExist) {
                const error = new Error("Token no válido");
                return res.status(404).json({ error: error.message });
            }
            ;
            res.send("Token valido. Crea tu nuevo password");
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static newPassword = async (req, res) => {
        try {
            const tokenExist = await Token_1.Token.findOne({ token: req.params.token });
            if (!tokenExist) {
                const error = new Error("Token no válido");
                return res.status(404).json({ error: error.message });
            }
            ;
            const user = await User_1.User.findById(tokenExist.user);
            user.password = await (0, auth_1.hashPassword)(req.body.password);
            await Promise.allSettled([tokenExist.deleteOne(), user.save()]);
            return res.send("Contraseña actualizada");
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static user = (req, res, next) => {
        return res.status(200).json(req.user);
    };
    static updateProfile = async (req, res) => {
        try {
            const { name, email } = req.body;
            const userExist = await User_1.User.findOne({ email });
            if (userExist && userExist.id.toString() !== req.user.id.toString()) {
                const error = new Error('El correo electrónico ya se encuentra registrado');
                return res.status(409).json({ error: error.message });
            }
            ;
            req.user.name = name;
            req.user.email = email;
            await req.user.save();
            return res.send('Perfil actualizado');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static updatePassword = async (req, res) => {
        try {
            const { current_password, password, password_confirmation } = req.body;
            const user = await User_1.User.findById(req.user.id);
            const validPassword = await (0, auth_1.checkPassword)(current_password, user.password);
            if (!validPassword) {
                const error = new Error('Contraseña actual incorrecta');
                return res.status(401).json({ error: error.message });
            }
            ;
            if (password !== password_confirmation) {
                const error = new Error('La nueva contraseña no coincide con la contraseña de confirmación');
                return res.status(400).json({ error: error.message });
            }
            ;
            req.user.password = await (0, auth_1.hashPassword)(password);
            await req.user.save();
            return res.send('Contraseña actualizada');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static checkPassword = async (req, res) => {
        try {
            const { password } = req.body;
            const user = await User_1.User.findById(req.user.id);
            const validPassword = await (0, auth_1.checkPassword)(password, user.password);
            if (!validPassword) {
                const error = new Error('La contraseña no es válida');
                return res.status(401).json({ error: error.message });
            }
            ;
            return res.send('Passwor válido');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
}
exports.UserController = UserController;
;
//# sourceMappingURL=UserController.js.map