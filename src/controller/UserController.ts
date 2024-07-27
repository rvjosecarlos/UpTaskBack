import { NextFunction, Request, response, Response } from "express";
import colors from "colors";
import { IUser, User } from "../model/User";
import { Token } from "../model/Token"
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class UserController {
    static createUser = async ( req: Request, res: Response ) => {
        try{

            const { password, email } = req.body;

            // Prevenir duplicados
            const userExist = await User.findOne({ email });
            if( userExist ){
                const error = new Error('El usuario ya se encuentra registrado');
                return res.status(409).json({ error: error.message });
            };

            // Crear usuario
            const user = new User(req.body);
            user.password = await hashPassword(password);

            // Crear token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            // Enviar correo electrónico
            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                token: token.token,
                email: user.email
            });

            await Promise.allSettled([ user.save(), token.save() ]);
            return res.send('Cuenta creada; revisa tu email para confirmarla');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static confirmUser = async ( req: Request, res: Response ) => {
        try{
            // Validar que el token exista
            const token = await Token.findOne({ token: req.body.token });
            if( !token ){
                const error = new Error('Token no válido');
                return res.status(404).json({ error: error.message });
            };

            // Confirmar al usuario
            const user = await User.findById(token.user);
            user.confirmed = true;

            // Guardar cambios y eliminar el token
            await Promise.allSettled([ user.save(), token.deleteOne() ]);
            res.send('Cuenta confirmada');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static login = async ( req: Request, res: Response ) => {
        try{ 
            // Validar que el usuario exista
            const user = await User.findOne({ email: req.body.email });
            if( !user ){
                const error = new Error('Usuario no registrado');
                return res.status(404).json({ error: error.message });
            };

            // Validar que el usuario este confirmado
            if( !user.confirmed ){

                const oldToken = await Token.findOne({ user: user.id });
                if( oldToken ){
                    await oldToken.deleteOne();
                };

                const newToken = new Token();
                newToken.user = user.id;
                newToken.token = generateToken();
                await newToken.save();

                await AuthEmail.sendConfirmationEmail({
                    name: user.name,
                    token: newToken.token,
                    email: user.email
                });

                const error = new Error('Usuario no confirmado. Hemos enviado un nuevo token de confirmación a tu cuenta de correo electrónico');
                return res.status(401).json({ error: error.message });
            }

            // Validar que la contraseña sea correcta
            const validPassword = await checkPassword( req.body.password, user.password );
            if( !validPassword ){
                const error = new Error('Usuario o contraseña no válidos');
                return res.status(401).json({ error: error.message })
            }

            // Genera un JWT para mantener la sesión
            const jwToken = generateJWT({ id: user.id });
            res.send(jwToken);
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static requestConfirmationCode = async ( req: Request, res: Response ) => {
        try{
            const user = await User.findOne({ email: req.body.email });
            if( !user ){
                const error = new Error('Correo electrónico no registrado');
                return res.status(404).json({ error: error.message });
            };

            if( user.confirmed ){
                const error = new Error('El correo ya se encuentra confirmado');
                return res.status(403).json({error: error.message });
            };

            const oldToken = await Token.findOne({ user: user.id });            
            if( oldToken ){
                await oldToken.deleteOne();
            };

            const newToken = new Token();
            newToken.token = generateToken();
            newToken.user = user.id;
            await newToken.save();

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                token: newToken.token,
                email: user.email
            });

            res.send('Se ha enviado un nuevo código de confirmación a tu cuenta de correo electrónico');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    static forgotPassword = async ( req: Request, res: Response ) => {
        try{
            const userExist = await User.findOne({ email: req.body.email });
            if( !userExist ){
                const error = new Error("Usuario no registrado");
                return res.status(404).json({ error: error.message });
            };

            const oldToken = await Token.findOne({ user: userExist.id });            
            if( oldToken ){
                await oldToken.deleteOne();
            };

            console.log(colors.bgBlue.bold(new Date(Date.now()).toString()));
            const newToken = new Token();
            newToken.user = userExist.id,
            newToken.token = generateToken();
            await newToken.save();

            await AuthEmail.sendPasswordResetToken({
                name: userExist.name,
                email: userExist.email,
                token: newToken.token
            });

            return res.send("Se envió un nuevo toke a tu E-mail");
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static validateToken = async ( req: Request, res: Response ) => {
        try{
            const tokenExist = await Token.findOne({ token: req.body.token });
            if( !tokenExist ){
                const error =  new Error("Token no válido");
                return res.status(404).json({ error: error.message });
            };

            res.send("Token valido. Crea tu nuevo password");
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static newPassword = async ( req: Request, res: Response ) => {
        try{
            const tokenExist = await Token.findOne({ token: req.params.token });
            if( !tokenExist ){
                const error = new Error("Token no válido");
                return res.status(404).json({ error: error.message });
            };

            const user = await User.findById(tokenExist.user);
            user.password = await hashPassword(req.body.password);
            await Promise.allSettled([ tokenExist.deleteOne(), user.save() ]);
            return res.send("Contraseña actualizada");
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static user = ( req: Request, res: Response, next: NextFunction ) => {
        return res.status(200).json(req.user);
    };

    static updateProfile = async ( req: Request, res: Response ) => {
        try{
            const { name, email } = req.body;
            const userExist = await User.findOne({ email });
            if( userExist && userExist.id.toString() !== req.user.id.toString() ){
                const error = new Error('El correo electrónico ya se encuentra registrado');
                return res.status(409).json({ error: error.message });
            };

            req.user.name = name;
            req.user.email = email;

            await req.user.save();

            return res.send('Perfil actualizado');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static updatePassword = async ( req: Request, res: Response ) => {
        try{
            const { current_password, password, password_confirmation } = req.body;
            const user = await User.findById(req.user.id);
            const validPassword = await checkPassword(current_password, user.password );
            if( !validPassword ){
                const error = new Error('Contraseña actual incorrecta');
                return res.status(401).json({ error: error.message });
            };

            if( password !== password_confirmation ){
                const error = new Error('La nueva contraseña no coincide con la contraseña de confirmación');
                return res.status(400).json({ error: error.message });
            };

            req.user.password = await hashPassword(password);
            await req.user.save();

            return res.send('Contraseña actualizada');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static checkPassword = async ( req: Request, res: Response ) => {
        try{
            const { password } = req.body;
            const user = await User.findById(req.user.id);
            const validPassword = await checkPassword(password, user.password);
            if( !validPassword ){
                const error = new Error('La contraseña no es válida');
                return res.status(401).json({ error: error.message });
            };
            return res.send('Passwor válido');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
};